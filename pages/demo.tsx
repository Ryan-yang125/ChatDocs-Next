import { useState } from 'react';

import { db } from '@/utils/db-client';

import { IDocMeta } from '@/types';

const text =
  "Skip to content Documentation Guides Search... ⌘ K Feedback Help Blog Login ← Back To Guides How can I use files in Serverless Functions on Vercel? You can import files to be used inside a Vercel Serverless Functions as follows: // api/hello.js import { readFileSync } from 'fs'; import path from 'path'; export default function handler(req, res) { const file = path.join(process.cwd(), 'files', 'test.json'); const stringified = readFileSync(file, 'utf8'); res.setHeader('Content-Type', 'application/json'); return res.end(stringified); } An example Serverless Function that reads from the filesystem. Next.js You can also read files from inside server-side Next.js data fetching methods like getStaticProps or with API Routes, both of which use Serverless Functions when deployed to Vercel: // pages/index.js import { readFileSync } from 'fs'; import path from 'path'; export function getStaticProps() { const file = path.join(process.cwd(), 'posts', 'test.json'); const data = readFileSync(file, 'utf8'); return { props: { data, }, }; } export default function Home({ data }) { return <code>{data}</code>; } A Next.js application that reads from the filesystem. Using temporary storage Sometimes, you may need to save a file temporarily before sending it for permanent storage to a third-party storage service like Amazon S3. For example, if you are generating a PDF from content that is provided on the client-side, you will first need to save the PDF data temporarily before you can upload it to your the third-party storage service. In this case, you can use the /tmp folder available with serverless functions. The example code below is for an api endpoint that you can call from the front-end. You pass the title and filename of the PDF file to be created as query parameters. It uses pdfkit to create the pdf file and write it to the tmp folder so that the PDF content is read from that location and passed to the parameters of the AWS S3 SDK. // api/savepdf.js const PDFDocument = require('pdfkit'); const fs = require('fs'); import aws from 'aws-sdk'; export default async function handler(req, res) { //Send the data for the pdf in the request as query params such as the title and filename const { query: { title, filename }, } = req; const doc = new PDFDocument(); //use the tmp serverless function folder to create the write stream for the pdf let writeStream = fs.createWriteStream(`/tmp/${filename}.pdf`); doc.pipe(writeStream); doc.text(title); doc.end(); writeStream.on('finish', function () { //once the doc stream is completed, read the file from the tmp folder const fileContent = fs.readFileSync(`/tmp/${filename}.pdf`); //create the params for the aws s3 bucket var params = { Key: `${filename}.pdf`, Body: fileContent, Bucket: 'your-s3-bucket-name', ContentType: 'application/pdf', }; //Your AWS key and secret pulled from environment variables const s3 = new aws.S3({ accessKeyId: process.env.YOUR_AWS_KEY, secretAccessKey: process.env.YOUR_AWS_SECRET, }); s3.putObject(params, function (err, response) { res.status(200).json({ response: `File ${filename} saved to S3` }); }); }); } API Endpoint using the tmp folder to generate and send a PDF file Couldn't find the guide you need? Frameworks Next.js Create React App Svelte Nuxt Gatsby Vue Angular More Frameworks Resources Documentation Experts Customers Guides Help API Reference OSS Command-Line Integrations Company Home Blog Changelog About Careers Pricing Enterprise Security Next.js Conf Partners Contact Us Legal Privacy Policy Terms of Service Trademark Policy Inactivity Policy DMCA Policy Support Terms DPA SLA Sub-processors Cookie Preferences Event Terms and Conditions Job Applicant Privacy Notice Copyright © 2023 Vercel Inc. All rights reserved. Status: All systems normal. Light ";

export default function Demo() {
  const [fileName, setFileName] = useState('sampletext');
  const [question, setQuestion] = useState('');
  const [ans, setAns] = useState('');

  const handleDocs = async () => {
    const response = await fetch('/api/docHandle', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
    const model: IDocMeta['model'] = await response.json();
    console.log('handleDocs-getModels: ', model);
    const id = await db.docs.add({
      fileName,
      fileSourceData: text,
      model,
    });
    console.log('handleDocs-setToDb', id);
  };

  const handleQuestion = async () => {
    const response = await fetch('/api/questionHandle', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
    const res = await response.json();
    console.log(res);
    setAns(JSON.stringify(res));
  };

  const initModel = async () => {
    const friends = await db.docs
      .where('fileName')
      .equals('sampletext')
      .toArray();
    const friend = friends[friends.length - 1];
    console.log('initModel-getFromDb', friend);
    const response = await fetch('/api/initModel', {
      method: 'POST',
      body: JSON.stringify({ ...friend }),
    });
  };

  return (
    <>
      FileName
      <input type="text" value={fileName} readOnly />
      <button onClick={handleDocs}>add model!</button>
      <br />
      <button onClick={initModel}>initModel!</button>
      Question
      <input
        type="text"
        value={question}
        onChange={(ev) => setQuestion(ev.target.value)}
      />
      <button onClick={handleQuestion}>ask me!</button>
      Ans
      <input type="text" value={ans} readOnly />
    </>
  );
}
