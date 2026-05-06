

// SET session data
export const SetSession = (data) => {
  localStorage.setItem("data", JSON.stringify(data));
};

// UPDATE session data
export const UpdateSession = (newData) => {
  try {
    const existing = localStorage.getItem("data");
    let parsed = existing ? JSON.parse(existing) : {};

    const updatedData = {
      ...parsed,
      data: {
        ...parsed.data,
        ...newData, // email/mobile update here
      },
    };

    localStorage.setItem("data", JSON.stringify(updatedData));

    return updatedData;
  } catch (error) {
    console.log("UpdateSession error:", error);
  }
};

// GET full session data
export const GetSessionData = () => {
  const data = localStorage.getItem("data");
  return data ? JSON.parse(data) : null;
};

// DESTROY session (logout)
export const SessionDestroy = () => {
  localStorage.clear();
  console.log("Session destroyed, all data cleared.");

};

// GET access token
export const GetToken = () => {
  const data = localStorage.getItem("data");
  return data ? JSON.parse(data).access_token : null;
};

// SET society data
export const SetSocietyData = (data) => {
  localStorage.setItem("currentSociety", JSON.stringify(data));
};

// GET society data
export const GetSocietyData = () => {
  const data = localStorage.getItem("currentSociety");
  return data ? JSON.parse(data) : null;
};