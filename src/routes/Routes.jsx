import Sidebar from "../components/Sidebar";
import LoginPage from "../features/auth/LoginPage";
import Dashboard from "../pages/Dashboard";
import Members from "../pages/Members";
import NoticeBoard from "../pages/NoticeBoard";
import Polls from "../pages/Polls";


const routes = [
    { path: "/", exact: true, name: "Sidebar", element: Sidebar },
    { path: "/dashboard", name: "Dashboard", element: Dashboard },
    { path: "/members", name: "Members", element: Members },
    { path: "/polls", name: "Polls", element: Polls },
    { path: "/noticeBoard", name: "Notice Board", element: NoticeBoard },
];

export default routes;