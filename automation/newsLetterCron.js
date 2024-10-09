import cron from "node-cron";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

export const newsLetterCron = () => {
  cron.schedule("* * */1 * *", async () => {
    const jobs = await Job.find({ newsLettersSent: false });
    for (const job of jobs) {
      try {
        const filteredUsers = await User.find({
          $or: [
            { "niches.firstNiche": job.jobNiche },
            { "niches.secondNiche": job.jobNiche },
            { "niches.thirdNiche": job.jobNiche },
          ],
        });
        for (const user of filteredUsers) {
          const subject = `Hot Job Alert: ${job.title} in ${job.jobNiche} Positions Available Now!`;
          const message = `Hi ${user.name},

            We’ve got some exciting opportunities just for you!

            Several companies are urgently hiring ${job.title} with competitive salaries, flexible working environments, and growth potential. Whether you specialize in MongoDB, Express.js React, or Node.js, these roles are perfect for showcasing your skills and advancing your career.

            Current Openings:

            ${job.title} - ${job.location} - ${job.salary}
            ${job.title} - ${job.location} - ${job.salary}
            ${job.title} - ${job.location} - ${job.salary}
            Don’t miss out on these hot job opportunities! Apply now to take the next big step in your career.

            For more details or to submit your application, reply to this email or visit our website.

            Best regards,
            ${job.companyName}`;
          sendEmail({
            email: user.email,
            subject,
            message,
          });
        }
        job.newsLettersSent = true;
        await job.save();
      } catch (error) {
        console.log("Error occured in node corn");
        return next(console.error(error || "Some Error in node corn"));
      }
    }
  });
};
