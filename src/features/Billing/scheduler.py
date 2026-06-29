"""
app/utils/scheduler.py

APScheduler — auto bill generation + penalty processing with full DB logging.

Install:
    pip install APScheduler --break-system-packages

Add to app/__init__.py:
    from app.utils.scheduler import init_scheduler
    init_scheduler(app)
"""

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
scheduler = BackgroundScheduler(timezone="Asia/Kolkata")


def _get_ist_now():
    """Return current IST time as string."""
    from datetime import timezone, timedelta
    ist = timezone(timedelta(hours=5, minutes=30))
    return datetime.now(ist).strftime("%Y-%m-%d %H:%M:%S")


def _run_auto_bill_generation(app):
    """Runs daily at 00:05 AM IST."""
    with app.app_context():
        from app import db
        log_id = None
        connection = db.engine.raw_connection()
        try:
            cursor = connection.cursor()

            # SP handles its own logging — just call it
            cursor.execute("CALL SP_AutoGenerateBills(NULL, NULL)")
            results = []
            while True:
                if cursor.description:
                    cols = [c[0] for c in cursor.description]
                    rows = [dict(zip(cols, r)) for r in cursor.fetchall()]
                    results.extend(rows)
                if not cursor.nextset():
                    break
            connection.commit()
            cursor.close()

            logger.info(f"[SCHEDULER][{_get_ist_now()}] Auto bill generation: {results}")

        except Exception as e:
            logger.error(f"[SCHEDULER][{_get_ist_now()}] Auto bill generation FAILED: {e}")
            # Log failure to DB
            try:
                cur2 = connection.cursor()
                cur2.execute("""
                    INSERT INTO scheduler_logs
                        (society_id, job_type, trigger_type, status, error_details,
                         started_at, finished_at, duration_seconds)
                    VALUES (NULL, 'auto_bill_generate', 'auto', 'failed', %s, NOW(), NOW(), 0)
                """, (str(e)[:500],))
                connection.commit()
                cur2.close()
            except Exception: pass
        finally:
            connection.close()


def _run_auto_penalty(app):
    """Runs daily at 01:00 AM IST."""
    with app.app_context():
        from app import db
        connection = db.engine.raw_connection()
        try:
            cursor = connection.cursor()

            # SP handles its own logging
            cursor.execute("CALL SP_ApplyPenalties(NULL, NULL)")
            results = []
            while True:
                if cursor.description:
                    cols = [c[0] for c in cursor.description]
                    rows = [dict(zip(cols, r)) for r in cursor.fetchall()]
                    results.extend(rows)
                if not cursor.nextset():
                    break
            connection.commit()
            cursor.close()

            logger.info(f"[SCHEDULER][{_get_ist_now()}] Auto penalty: {results}")

        except Exception as e:
            logger.error(f"[SCHEDULER][{_get_ist_now()}] Auto penalty FAILED: {e}")
            try:
                cur2 = connection.cursor()
                cur2.execute("""
                    INSERT INTO scheduler_logs
                        (society_id, job_type, trigger_type, status, error_details,
                         started_at, finished_at, duration_seconds)
                    VALUES (NULL, 'auto_penalty', 'auto', 'failed', %s, NOW(), NOW(), 0)
                """, (str(e)[:500],))
                connection.commit()
                cur2.close()
            except Exception: pass
        finally:
            connection.close()


def init_scheduler(app):
    if scheduler.running:
        return

    # Bill generation — daily 00:05 AM IST
    scheduler.add_job(
        func     = lambda: _run_auto_bill_generation(app),
        trigger  = CronTrigger(hour=0, minute=5, timezone="Asia/Kolkata"),
        id       = "auto_bill_generation",
        name     = "Auto Bill Generation",
        replace_existing   = True,
        misfire_grace_time = 3600,
    )

    # Penalty — daily 01:00 AM IST
    scheduler.add_job(
        func     = lambda: _run_auto_penalty(app),
        trigger  = CronTrigger(hour=1, minute=0, timezone="Asia/Kolkata"),
        id       = "auto_penalty",
        name     = "Auto Penalty Application",
        replace_existing   = True,
        misfire_grace_time = 3600,
    )

    scheduler.start()
    logger.info(f"[SCHEDULER][{_get_ist_now()}] Started — Bill @ 00:05 IST, Penalty @ 01:00 IST")
