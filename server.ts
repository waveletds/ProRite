import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

// Lazy-initialize Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // 1. Topic Development Endpoint
  app.post('/api/gemini/topic', async (req: Request, res: Response) => {
    try {
      const { topic, academicLevel, department } = req.body;
      if (!topic) {
        return res.status(400).json({ error: 'Topic is required.' });
      }

      const client = getGeminiClient();
      if (!client) {
        // Fallback content in case GEMINI_API_KEY is not setup
        return res.json({
          topic: topic,
          background: `### Socio-Economic Overview and Context\nThe topic "${topic}" sits at the intersection of local development policies and academic practice in ${department || 'this discipline'}. Historical indices suggest that addressing these questions has profound implications for regional stakeholders operating within ${academicLevel || 'undergraduate'} pipelines.\n\nIn recent literature, studies indicate standard developmental lags in sub-Saharan states due to limited dataset validation, erratic training configurations, and suboptimal infrastructure alignment. Solving this problem represents a core milestone for future practitioners.`,
          problemStatement: `Despite the critical need for solutions in "${topic}", current frameworks suffer from limited empirical testing, poor structural integration, and systemic operational friction. This results in standard output deficits and persistent capital leaks across both local and national levels.`,
          objectives: [
            {
              objective: `To design and evaluate a robust, localized model to address the core challenges of "${topic}".`,
              question: `What are the structural design parameters required for establishing this framework?`,
              hypothesis: 'There is a significant positive relationship between systematic design adoption and regional output stability.'
            },
            {
              objective: `To analyze the performance trade-offs under varying computational and data stresses.`,
              question: 'How do resource allocations impact real-time execution bounds?',
              hypothesis: 'Optimization guidelines will lead to a resource reduction of at least 30%.'
            }
          ],
          scope: `The research boundary is restricted to sample sizes drawn across regional institutions in the current fiscal year, using a standard double-blind sample of selected research respondents.`,
          significance: 'For policy-makers, researchers, and field specialists, this project offers primary empirical metrics, structural templates, and policy suggestions to mitigate productivity issues.',
          isDemoFallback: true
        });
      }

      const prompt = `You are a high-level academic research consultant and professor. Develop the research structure for the following academic topic:
Topic: "${topic}"
Academic Level: ${academicLevel || 'Undergraduate / Graduate'}
Department: ${department || 'General Science / Arts'}

Please return a JSON response containing the following fields of an academic research structure. 
Return ONLY valid JSON.
{
  "topic": "the polished, professionalized version of the topic",
  "background": "an elegant academic background introduction (at least 3 paragraphs or 300 words with citations)",
  "problemStatement": "a precise, compelling academic statement of the problem",
  "objectives": [
    {
      "objective": "Objective 1: To...",
      "question": "Research question corresponding to Objective 1...",
      "hypothesis": "Hypothesis corresponding to Objective 1 (if applicable, else omit)"
    },
    {
      "objective": "Objective 2: To...",
      "question": "Research question corresponding to Objective 2...",
      "hypothesis": "Hypothesis corresponding to Objective 2 (if applicable, else omit)"
    }
  ],
  "scope": "The precise geographical and operational scope of the study",
  "significance": "Who will benefit from this study and why (students, governments, institutions, etc.)"
}`;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text || '{}';
      const jsonResult = JSON.parse(text);
      res.json(jsonResult);
    } catch (err: any) {
      console.error('Error in topic development api:', err);
      res.status(500).json({ error: 'Failed to develop topic: ' + err.message });
    }
  });

  // 2. Project / Chapter Builder Endpoint
  app.post('/api/gemini/chapter', async (req: Request, res: Response) => {
    try {
      const { topic, chapterNumber, chapterTitle, style, academicLevel, additionalDetails, existingChapters } = req.body;
      if (!topic || !chapterNumber) {
        return res.status(400).json({ error: 'Topic and chapter number are required.' });
      }

      const client = getGeminiClient();
      if (!client) {
        return res.json({
          content: `## Chapter ${chapterNumber}: ${chapterTitle || 'Draft Output'}\n\n### 2.1 Introduction to the ${chapterTitle || 'Study'}\nThis drafted section explores elements of *${topic}* within modern technical setups. As researchers suggest, optimizing models is highly critical under ${academicLevel} levels.\n\n### 2.2 Theoretical framework and core models\nHistorically, systems were configured linearly. However, modern approaches advocate for decentralized architectures that validate inputs iteratively. This maintains high throughput and minimizes data decay.\n\n\`\`\`\n[System Architecture Model]\nInput Vector -> [Encoding Layer] -> [Feature Selection] -> Output Matrix\n\`\`\`\n\n### 2.3 Empirical Precedents\nEvaluations of Southwest organizations identify that 72% suffer from performance mismatches when deploying non-optimized schemas.\n\n### References\n* Adegbola, A., & Nwosu, K. C. (2024). Computer Vision Architectures. *Journal of African Agritech Research*, 10(2), 24-35.\n* Okolo, F. A., & Alao, M. S. (2023). Lightweight neural networks. *Journal of Crop Science and AI*, 19(4), 312-329.`,
          references: [
            'Adegbola, A., & Nwosu, K. C. (2024). Computer Vision Architectures. Journal of African Agritech Research, 10(2).',
            'Okolo, F. A., & Alao, M. S. (2023). Lightweight neural networks. Journal of Crop Science and AI, 19(4).'
          ],
          isDemoFallback: true
        });
      }

      let existingPromptInfo = '';
      if (existingChapters) {
        existingPromptInfo = `The previous chapters are structured as: ${JSON.stringify(existingChapters)}. Keep continuity on themes, research questions, and citations.`;
      }

      const prompt = `You are a high-level academic writer. Draft an extensive, highly detailed academic section for:
Topic: "${topic}"
Chapter Number: ${chapterNumber}
Chapter Title: "${chapterTitle}"
Academic Level: ${academicLevel}
Reference Style: ${style}
Additional User Directives: "${additionalDetails || 'None specified'}"
${existingPromptInfo}

Generate the full chapter content in rich MARKDOWN format, featuring:
- Clear, descriptive academic sections (like 1.1, 1.2 or 3.1, 3.2 depending on chapter number).
- At least 5 in-text citations matching the chosen style (${style}).
- Professional academic language fitting a PhD-level thesis or published journal, with deep, analytical paragraphs.
- Clear structural layout.
- Include a separate array of citations/references in the JSON response.

Return a JSON with precisely:
{
  "content": "Full detailed markdown academic content...",
  "references": [
    "Full citation 1",
    "Full citation 2"
  ]
}
Return ONLY valid JSON.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const text = response.text || '{}';
      const jsonResult = JSON.parse(text);
      res.json(jsonResult);
    } catch (err: any) {
      console.error('Error in chapter generator api:', err);
      res.status(500).json({ error: 'Failed to build chapter: ' + err.message });
    }
  });

  // 3. Academic Rewriter Endpoint
  app.post('/api/gemini/rewrite', async (req: Request, res: Response) => {
    try {
      const { text, mode } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text to rewrite is required.' });
      }

      const client = getGeminiClient();
      if (!client) {
        return res.json({
          paraphrasedText: `[PARAPHRASED - ${mode || 'Formal Academic'}]\n\nIt is universally observed that the implementation of modern configurations dramatically stabilizes operational throughput. Extensive empirical data illustrates that these modular units reduce processing overhead by substantial ratios, thereby ensuring continuous performance viability in complex pipelines.`,
          clarityRating: '9.4/10',
          adjustmentsMade: ['Substituted colloquial descriptors with formal academic verbs', 'Enhanced noun phrase structures for structural integrity', 'Optimized clausal syntax for publishing criteria'],
          isDemoFallback: true
        });
      }

      const prompt = `You are a professional academic copyeditor. Rewrite and paraphase the following text into a premium academic style:
Text: "${text}"
Target Mode: "${mode || 'Formal Academic'}" (Options: Formal Academic, Journal Publication, Thesis Format, Conference Paper)

Your rewrite should:
- Elevate vocabulary using premium scholarly terms.
- Retain exact underlying facts, variables, and arguments but optimize clarity and sentence flow.
- Ensure strict academic tone.
- Highlight your specific structural adjustments.

Please provide a JSON output matching:
{
  "paraphrasedText": "The newly generated, sleek, high-end text...",
  "clarityRating": "Estimation of clarity (e.g. 9.5/10) with brief justification",
  "adjustmentsMade": [
    "Adjustment statement 1",
    "Adjustment statement 2"
  ]
}
Return only valid JSON.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const jsonResult = JSON.parse(response.text || '{}');
      res.json(jsonResult);
    } catch (err: any) {
      console.error('Error in rewriter api:', err);
      res.status(500).json({ error: 'Paraphrasing failed: ' + err.message });
    }
  });

  // 4. Similarity & Originality Checker Endpoint
  app.post('/api/gemini/originality', async (req: Request, res: Response) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Content text to review is required.' });
      }

      const client = getGeminiClient();
      if (!client) {
        // Return a simulated high-fidelity originality report
        const containsSocio = text.toLowerCase().includes('cassava') || text.toLowerCase().includes('disease') || text.toLowerCase().includes('model');
        const score = containsSocio ? 14 : 8;
        return res.json({
          score: score,
          originalText: text,
          matches: containsSocio ? [
            {
              source: 'University Cassava Consortium Reports (2024)',
              similarity: 12,
              text: 'cassava disease prediction and computer vision applications in Nigeria',
              citation: 'Animashaun, J. O. (2021). Cassava value chain and regional food stability.'
            }
          ] : [],
          gaps: [
            'Add a citation to support initial development statistics.',
            'Format secondary source listings to conform with structural guidelines.'
          ],
          isDemoFallback: true
        });
      }

      const prompt = `You are an academic assessor. Review the following text for potential originality, similarity matches in academic literature, and citation gaps:
Text: "${text}"

Assess the similarity percentage against common textbook concepts or published literature. If it contains generic passages or unreferenced facts, cite them.
Provide structured feedback on how to improve originality index.
Return a JSON structure matching:
{
  "score": a number from 0 to 100 representing similarity percentage (lower is better, e.g., 12),
  "matches": [
    {
      "source": "Name of journal, book, or repository database",
      "similarity": matching percentage (e.g., 8),
      "text": "The matched phrase extracted",
      "citation": "Recommended citation reference to fix it"
    }
  ],
  "gaps": [
    "Citation recommendation 1",
    "Citation recommendation 2"
  ]
}
Return only valid JSON.`;

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const jsonResult = JSON.parse(response.text || '{}');
      res.json(jsonResult);
    } catch (err: any) {
      console.error('Error in originality api:', err);
      res.status(500).json({ error: 'Originality assessment failed: ' + err.message });
    }
  });

  // 5. Copilot Chat Endpoint
  app.post('/api/gemini/copilot', async (req: Request, res: Response) => {
    try {
      const { message, history, currentTopic } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message payload is required.' });
      }

      const client = getGeminiClient();
      if (!client) {
        return res.json({
          text: `### ProRite Research Support Assistant\n\nRegarding your project on **"${currentTopic || 'Academic Research'}"**:\n\nTo build a highly robust project, I recommend focusing heavily on your **Research Methodology (Chapter Three)**. You should clearly define:\n1. Your Research Design (e.g., Experimental or Descriptive).\n2. Sampling Population and sample size computations using Cochran's formula.\n3. Validity guidelines using expert panel reviews.\n\nCould you share if you are collecting quantitative data (using structured survey questionnaires) or qualitative data (using open-ended interviewer sheets)? That will help me suggest the ideal statistical engines like SPSS, R, or Stata.`,
          isDemoFallback: true
        });
      }

      // Assemble chat context
      const chatHistory = history || [];
      const chatParts = [];
      
      // Add context instructions
      chatParts.push({
        text: `You are ProRite AI, a premium end-to-end academic research copilot and peer-review adviser.
Your job is to answer scholarly questions, help draft theses, explain complex data analyses, and help formulate references correctly.
The user is currently writing an academic project on: "${currentTopic || 'Unspecified Academic Subject'}".
Provide detailed, helpful, structured markdown feedback. Do not give shallow answers; write like an active partner in heavy science research.`
      });

      // Populate historical messages
      for (const msg of chatHistory) {
        chatParts.push({ text: `${msg.role === 'user' ? 'User: ' : 'Assistant: '} ${msg.content}` });
      }

      // Current message
      chatParts.push({ text: `User: ${message}` });

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: chatParts.map(p => p.text).join('\n\n'),
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error('Error in copilot api:', err);
      res.status(500).json({ error: 'Copilot query failed: ' + err.message });
    }
  });

  // Handle Vite Dev vs Production bundling
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ProRite AI Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server boot failed:', err);
});
