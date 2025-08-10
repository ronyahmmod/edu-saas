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

export default ntpTimestampMiddleware = async (req, res, next) => {
  try {
    const ntpTime = await getNtpTime();
    req.ntpTime = ntpTime;
    next();
  } catch (error) {
    console.error("NTP Error: ", error);
    req.ntpTime = new Date();
    next();
  }
};
