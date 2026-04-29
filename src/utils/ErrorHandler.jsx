// import { SessionDestroy } from "./SessionManagement";

const ErrorHandler = (error, navigation) => {
    console.log(error, "error handler")
    console.log(error.response, "error handler")
    console.log("Error Response Status:", error.response?.status);
    try {
        if (error.response?.status === 409) {
            // 👈 navigate to Login screen
            // return "Record already exists!";
            return error.response?.data?.message;

        } else if (error.response?.status === 404) {
            // return "User Not Found";
            return error.response?.data?.message;

        } else if (error.response?.status === 400) {
            // return "Bad Request";
            return error.response?.data?.message;

        } else if (error.response?.status === 401) {
            // SessionDestroy();
            navigation.navigate("/");
            return "Session Time Out";
            // return error.response?.data?.message;

        } else if (error.response.status === 500) {
            // return "Something went wrong on the server. Please try again later.";
            return error.response?.data?.message;
        } else {
            return "Something went wrong on the server. Please try again later.";
        }
    } catch (e) {
        // Handle the error thrown while processing the error
        return "Something went wrong on the server. Please try again later.";
    }
}

export default ErrorHandler;