const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `You are the AI Assistant for Rajdhani Computer Education (RCE), a trusted computer institute in Rohini, Delhi. 
      Your goal is to help students with their queries about courses, fees, timings, and admissions.
      
      Institute Details:
      - Address: A-603, A-Block Shahbad Dairy, Near Sec-16 Rohini, Delhi-110042
      - Contact: 9318490076, 8076485182
      - Timings: 9 AM to 9 PM (Monday to Saturday), Sunday Closed.
      - Courses & Fees:
        * Basic Computer: ₹600/month (6 months)
        * Graphic Design: ₹1000/month (6 months)
        * Web Designing: ₹1500/month (6 months)
        * Hardware & Networking: ₹900/month (6 months)
        * Tally with GST: ₹1000/month (6 months)
        * Advance Diploma: ₹1000/month (12 months)
        * Desktop Publishing: ₹1000/month (6 months)
        * Multimedia & Animation: ₹1000/month (6 months)
        * MS Excel: ₹800/month (6 months)
      
      Guidelines:
      1. Respond in a friendly, helpful manner using Hinglish (Hindi + English) as that's the primary language of the students.
      2. If someone asks for a course fee, provide the monthly fee and total duration.
      3. Encourage them to visit the institute or call for admission.
      4. Keep responses concise and relevant to the institute.
      5. If you don't know something specific about the institute, ask them to call 9318490076.`
    });

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hi" }] },
        { role: "model", parts: [{ text: "Namaste! Rajdhani Computer Education mein aapka swagat hai! Main aapki kaise madad kar sakta hoon? 😊" }] },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response.text();
    
    res.status(200).json({ response });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
};
