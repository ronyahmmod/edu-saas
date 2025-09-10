import ntpClient from "ntp-client";
// import catchAsync from '../utils/catchAsync';
const getNtpTime = () => {
  return new Promise((resolve, reject) => {
    ntpClient.getNetworkTime("pool.ntp.org", 123, (err, date) => {
      if (err) {
        reject(err);
      }
      resolve(date);
    });
  });
};

const ntpTimestampMiddleware = async (req, res, next) => {
  try {
    const ntpTime = await getNtpTime();
    req.rawNtpTime = ntpTime;
    req.localNtpTime = ntpTime.toLocaleString("en-BD", {
      timeZone: "Asia/Dhaka",
    });
    next();
  } catch (error) {
    console.error("NTP Error: ", error);
    req.ntpTime = new Date();
    next();
  }
};

export default ntpTimestampMiddleware;
