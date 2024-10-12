import axios from "axios";
const baseUrl = "https://api.kw.hrouf-academy.com";
export default class ApiManager {
  // User Apia <-- Login, Register, Logout , Update Profile , Get Profile ,otpConfirm , ResendOtp , ForgotPassword , ResetPassword -->
  /**
   * log out user
   *
   * @param {string} token
   * @returns {object} response
   */
  static async logOut(token) {
    let axiosResult = await axios.post(
      baseUrl + "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return axiosResult;
  }
  /**
   * log in user
   * @param {object} user
   * @returns {object} response
   */
  static async login(user) {
    const myHeaders = {
      "Content-Type": "application/json",
    };

    let axiosResult = await axios.post(baseUrl + "/auth/login", user, {
      headers: myHeaders,
    });
    return axiosResult;
  }
  /**
   * register user
   * @param {object} user
   * @returns {object} response
   *
   */

  static async register(user) {
    const myHeaders = {
      "Content-Type": "application/json",
    };
    let axiosResult = await axios.post(baseUrl + "/auth/register", user, {
      headers: myHeaders,
    });
    return axiosResult;
  }
  /**
   * Otp send confirmation
   * @param {string} token
   * @returns {object} response
   */
  static async sendOtp(token) {
    let axiosResult = await axios.post(
      baseUrl + "/auth/SendOTPConfirmAccount",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    return axiosResult;
  }
  /**
   * Otp Confirm
   * @param {object} user
   * @returns {object} response
   */
  static async otpConfirm(otp, token) {
    let axiosResult = await axios.post(
      baseUrl + `/auth/ConfirmAccountOTP?otp=${otp}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    return axiosResult;
  }
  /**
   * Update Profile
   * @param {object} user
   * @param {string} token
   * @returns {object} response
   *
   */
  static async updateProfile(user, token) {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    let axiosResult = await axios.put(
      baseUrl + "/accounts/updatecurrent",
      user,
      {
        headers: headers,
      }
    );
    return axiosResult;
  }
  /**
   * Get Profile
   * @param {string} token
   * @returns {object} response
   */
  static async getProfile(token) {
    let axiosResult = await axios.get(`${baseUrl}/auth/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return axiosResult;
  }
  /**
   * check if session is still valid
   * @param {string} token
   */
  static async checkIfSessionEnd(token) {
    let axiosResult = await axios.post(
      baseUrl + "/auth/validate",
      {},
      {
        headers: { Authorization: `Bearer ${token}` }, // Correct usage in axios
      }
    );

    return axiosResult;
  }
  /**
   * send email to send reset password otp to user
   * @param {string} email
   * @returns {object} response
   *
   */
  static async forgotPasswordSendOtpToEmail(email) {
    let axiosResult = await axios.post(
      baseUrl + `/auth/SendOTPResetPassword?email=${email}`
    );

    return axiosResult;
  }
  /**
   * confirm otp for reset password
   * @param {string} otp
   * @param {string} email
   * @returns {object} response
   */
  static async confirmOtpForResetPassword(otp, email) {
    let axiosResult = await axios.post(
      baseUrl + `/auth/ConfirmResetPasswordOTP?OTP=${otp}&email=${email}`
    );

    return axiosResult;
  }
  /**
   * reset password
   * @param {object} data
   * @returns {object} response
   */
  static async resetPassword(email, password, token) {
    let data = {
      email: email,
      newPassword: password,
      token: token,
    };

    let axiosResult = await axios.post(
      baseUrl + `/auth/ResetPassword`,
      data
    );

    return axiosResult;
  }
  // services Api <-- subjects --> <-- units -->  <-- lessons --> <-- join lesson --> <-- get my lessons--> <-- contactUs -->
  /**
   * get all subjects
   * @param {number} levelId
   * @returns {object} response
   */
  static async getSubjects(levelId) {
    let axiosResult = await axios.get(baseUrl + `/subjects/l/${levelId}`);
    return axiosResult;
  }
  /**
   * get all units for subject
   * @param {string} subjectId
   * @returns {object} response
   */
  static async getUnits(subjectId) {
    let axiosResult = await axios.get(baseUrl + `/chapters/s/${subjectId}`);
    return axiosResult;
  }
  /**
   * get all lessons for unit
   * @param {string} token
   * @param {string} unitId
   * @returns {object} response
   */
  static async getLessons(unitId) {
    let axiosResult = await axios.get(baseUrl + `/lessons/c/${unitId}`);
    return axiosResult;
  }

  /**
   * Contact us
   * @param {object} data
   * @returns {object} response
   *
   */
  static async contactUs(data) {
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let axiosResult = await axios.post(baseUrl + "/contact-us", data, config);

    return axiosResult;
  }
}
