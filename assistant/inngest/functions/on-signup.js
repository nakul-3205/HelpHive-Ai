import { inngest } from "../client.js";
import User from '../../models/User.js'
import { NonRetriableError } from "inngest";

export const onSignup = inngest.createFunction(
       {id:'on-signup', retries: 3},
       {event: 'user/signup'},
         async ({event, step}) => {
            try {
              const { email } = event.data;
              const user=await step.run('get-user-email', async () => {
                  const userObject=await User.findOne({email});
                  if(!userObject) {
                      throw new NonRetriableError('User not found');  
                    }
  
                  return userObject;
              });
              await step.run('send-welcome-email', async () => {
                  const subject= `Welcome to HelpHive`;
                  const message = `Hello ${event.data.name}, welcome to HelpHive! We're excited to have you on board.`;
                  await sendmail(user.email, subject, message);
                  return { success: true }; 
              });
            } catch (error) {
                console.error('❌❌Error in onSignup function:', error);
                // throw new NonRetriableError('Failed to process signup event');
                return { success: false, error: error.message };
              
            } 

            
    }
)