import axios from "axios";
const baseUrl = "https://api-v3.hrouf-academy.com";
const getHeaders = (token = null) => {
  return token
    ? {
        Authorization: `Bearer ${token}`,
        izitechs_origin: window.location.href,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
        izitechs_origin: window.location.href,
      };
};
export default class ApiManager {
  // login Apis <-- Logout, Login, Register, sendOtp, otpConfirm , forgotPasswordSendOtpToEmail, confirmOtpForResetPassword, resetPassword -->
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
        headers: getHeaders(token),
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
    let axiosResult = await axios.post(baseUrl + "/auth/login", user, {
      headers: {
        ...getHeaders(),
      },
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
    let axiosResult = await axios.post(baseUrl + "/auth/register", user, {
      headers: getHeaders(),
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
          ...getHeaders(token),
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
          ...getHeaders(token),
        },
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
      baseUrl + `/auth/SendOTPResetPassword?email=${email}`,
      {},
      {
        headers: getHeaders(),
      }
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
      baseUrl + `/auth/ConfirmResetPasswordOTP?OTP=${otp}&email=${email}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          ...getHeaders(),
        },
      }
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

    let axiosResult = await axios.post(baseUrl + `/auth/ResetPassword`, data, {
      headers: {
        "Content-Type": "application/json",
        ...getHeaders(),
      },
    });

    return axiosResult;
  }

  // profile Apis <-- updateProfile, getProfile, updateEmail, updatePassword, checkIfSessionEnd,  -->
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
      ...getHeaders(token),
    };

    let axiosResult = await axios.put(
      baseUrl + "/accounts/update-profile",
      user,
      {
        headers: headers,
      }
    );
    return axiosResult;
  }
  /**
   * @param {string} token
   * @param {File} image
   * @returns {object}
   */
  static async updateImage(token, image) {
    const formdata = new FormData();

    formdata.append("image", image);
    const axiosResult = await axios.put(
      baseUrl + "/accounts/update-profile-image",
      formdata,
      {
        headers: {
          ...getHeaders(token),
          "Content-Type": "multipart/form-data",
        },
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
   * update Email
   * @param {string} email
   * @param {string} token
   * @returns {object} response
   */
  static async updateEmail(email, token) {
    let axiosResult = await axios.post(
      baseUrl + `/auth/change-email?email=${email}`,
      {},
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  /**
   * update password
   * @param {object} password
   * @param {string} token
   */
  static async updatePassword(password, token) {
    let axiosResult = await axios.post(
      baseUrl + `/auth/change-password`,
      password,
      {
        headers: getHeaders(token),
      }
    );
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
        headers: getHeaders(token),
      }
    );

    return axiosResult;
  }
  // Authorized services Api <--  subscribeWithCode, subscribeWithPayment, getMyPayments, getMyPackages, getVideoComments -->

  /**
   * subscribe to package with code
   * @param {string} token
   * @param {string} code
   * @returns {object} response
   */
  static async subscribeWithCode(token, packageId, code) {
    let axiosResult = await axios.post(
      baseUrl + `/plans/${packageId}/code/${code}`,
      {},
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  /**
   * subscribe to package with payment
   * @param {string} token
   * @param {string} packageId
   * @returns {object} response
   */
  static async subscribeWithPayment(token, packageId) {
    let axiosResult = await axios.post(
      baseUrl + `/plans/${packageId}/subscribe`,
      {},
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  /**
   * get my payments
   * @param {string} token
   * @returns {object} response
   *
   */
  static async getMyPayments(token) {
    let axiosResult = await axios.get(baseUrl + `/payments/history`, {
      headers: getHeaders(token),
    });
    return axiosResult;
  }
  /**
   * get my packages
   * @param {string} token
   * @returns {object} response
   */
  static async getMyPackages(token) {
    let axiosResult = await axios.get(baseUrl + `/plans/subscribed`, {
      headers: getHeaders(token),
    });
    return axiosResult;
  }

  /**
   * get package comments
   * @param {string} token
   * @param {string} packageId
   * @param {string} videoId
   * @returns {object} response
   */
  static async getVideoComments(token, packageId, videoId) {
    let axiosResult = await axios.get(
      baseUrl + `/plans/${packageId}/v/${videoId}/c`,
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  /**
   * add comment to package
   * @param {string} token
   * @param {string} packageId
   * @param {string} videoId
   * @param {string} comment
   * @returns {object} response
   */
  static async addComment(token, packageId, commentParentId, videoId, comment) {
    let axiosResult = await axios.post(
      baseUrl + `/plans/${packageId}/v/${videoId}/c`,
      {
        // parentId when replying to a comment
        parentId: commentParentId,
        text: comment,
      },
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  /**
   * reply to comment
   * @param {string} token
   * @param {string} commentParentId
   * @param {string} comment
   * @returns {object} response
   */
  static async editComment(token, packageId, videoId, commentId, comment) {
    let axiosResult = await axios.post(
      baseUrl + `/plans/${packageId}/v/${videoId}/c/${commentId}`,
      { text: comment },
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  /**
   * Delete comment
   * @param {string} token
   * @param {string} commentId
   * @returns {object} response
   */
  static async deleteComment(token, packageId, videoId, commentId) {
    let axiosResult = await axios.delete(
      baseUrl + `/plans/${packageId}/v/${videoId}/c/${commentId}`,
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  // unAuthorized services Api <-- getSubjects, getPackages, getPackageDetails, contactUs -->
  /**
   * get all subjects
   * @returns {object} response
   */
  static async getSubjects() {
    let axiosResult = await axios.get(baseUrl + `/subjects`, {
      headers: getHeaders(),
    });
    return axiosResult;
  }
  /**
   * get all Packages
   * @param {string} EduSchoolLevel
   * @param {string} SubjectId
   * @returns {object} response
   */
  static async getPackages(EduSchoolLevel, SubjectId, token) {
    const EduSchoolLevelParam = EduSchoolLevel
      ? `EduSchoolLevel=${EduSchoolLevel}&`
      : "";
    const SubjectIdParam = SubjectId ? `SubjectId=${SubjectId}` : "";
    let axiosResult = await axios.get(
      baseUrl + `/plans?${EduSchoolLevelParam}${SubjectIdParam}`,
      {
        headers: getHeaders(token),
      }
    );
    return axiosResult;
  }
  /**
   * get Package details
   * @param {string} packageId
   * @param {string} token
   * @returns {object} response
   */
  static async getPackageDetails(packageId, token) {
    let axiosResult = await axios.get(baseUrl + `/plans/${packageId}`, {
      headers: getHeaders(token),
    });
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
        ...getHeaders(),
      },
    };
    let axiosResult = await axios.post(baseUrl + "/contact-us", data, config);

    return axiosResult;
  }
}
