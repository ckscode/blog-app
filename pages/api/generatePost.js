import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb"
export default withApiAuthRequired( async function handler(req, res) {

  const {user} = await getSession(req,res);
  const client = await clientPromise;
  const db = client.db("Blog");

  const userProfile =await db.collection("users").findOne({
    auth0Id:user.sub
  })

if(!userProfile?.availableTokens){
  res.status(403);
  return;
}

    const {topic,keywords} = req.body;
    if (!topic || !keywords) {
      res.status(422);
      return;
    }
  
    if (topic.length > 80 || keywords.length > 80) {
      res.status(422);
      return;
    }
  
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

//   const topic = "marvel comics";
//   const keywords = "thor,ironman";

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO friendly blog post generator called Blog-OpenAI. You are designed to output markdown without frontmatter",
      },
      {
        role: "user",
        content: `
        Generate me a blog post on the following topics delimited by triple hyphens:
        ---
        ${topic}
        ---
        Targeting the following comma separated keywords delimited by triple hyphens
        ---
        ${keywords}
        ---
        `,
      },
    ],
  });

  const postContent = response.data.choices[0]?.message?.content;

  const seoResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-1106",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO friendly blog post generator called Blog-OpenAI. You are designed to output JSON.Do not include HTML tags in your output",
      },
      {
        role: "user",
        content: `
        Generate an SEO friendly title and meta description for the following blog post:
        ${postContent}
        ---
        The output JSON must be in the following format:
        {
        title:"example title",
        metaDescription:"example meta description"
        }
        `,
      },
    ],
    response_format: { type: "json_object" },
  });

  const seoJson = JSON.parse(seoResponse.data.choices[0]?.message?.content) || {};
  const { title, metaDescription } = seoJson

await db.collection("users").updateOne({
  auth0Id:user.sub
 },
{
    $inc:{
      availableTokens:-1
    }
})

const post = await db.collection("posts").insertOne({
  postContent,
  title,
  metaDescription,
  topic,
  keywords,
  userId:userProfile._id,
  createdAt:new Date()
})

  res.status(200).json({ postId:post.insertedId });
});
