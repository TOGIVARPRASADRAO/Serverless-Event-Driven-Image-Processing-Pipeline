# Serverless-Event-Driven-Image-Processing-Pipeline


# 📸 Image Upload & Auto Resize App (AWS Serverless)

A fully serverless web application that allows users to upload images, automatically resize them into multiple sizes (thumbnail, medium, large), and download them — powered by AWS.

---

## 🚀 Features

* 📤 Upload image from browser
* ⚡ Serverless processing using AWS Lambda
* 🖼️ Automatic resizing into:

  * Thumbnail (100x100)
  * Medium (300x300)
  * Large (800x800)
* ☁️ Storage using Amazon S3
* 🧠 Metadata stored in DynamoDB
* 📥 Download resized images from UI
* 🎨 Modern responsive UI with drag & drop

---

## 🏗️ Architecture Overview

```
Frontend (HTML/CSS/JS)
        ↓
API Gateway (HTTP POST)
        ↓
Lambda (image-upload-api)
        ↓
S3 (input bucket)
        ↓
S3 Event Trigger
        ↓
Lambda (image-processor)
        ↓
S3 (processed bucket)
        ↓
Frontend downloads images
```

---

## 🧰 Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: AWS Lambda (Python)
* Storage: Amazon S3
* API: Amazon API Gateway
* Database: Amazon DynamoDB

---

## 📂 Project Structure

```
project/
│
├── index.html
├── style.css
├── script.js
│
├── lambda/
│   ├── image-upload-api/
│   │   └── lambda_function.py
│   │
│   ├── image-processor/
│       └── lambda_function.py
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Create S3 Buckets

Create two buckets:

* `input-images-bucket-12345`
* `processed-images-bucket-togi-001`

Inside processed bucket, create folders:

```
thumbnails/
medium/
large/
```

---

### 2️⃣ Configure Bucket Permissions

#### Processed Bucket Policy (IMPORTANT)

Allow public read access:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadAccess",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::processed-images-bucket-togi-001/*"
    }
  ]
}
```

---

### 3️⃣ Create DynamoDB Table

* Table Name: `image-metadata`
* Primary Key: `image_id` (String)

---

### 4️⃣ Deploy Lambda Functions

#### 🔹 image-upload-api

* Runtime: Python 3.x
* Trigger: API Gateway (POST)

Responsibilities:

* Accept base64 image
* Upload to input S3 bucket

---

#### 🔹 image-processor

* Trigger: S3 Event (input bucket → PUT)
* Add permission: S3 → Lambda

Responsibilities:

* Resize image using PIL
* Save into processed bucket
* Store metadata in DynamoDB

---

### 5️⃣ Install Dependencies (for processor Lambda)

Package:

```
Pillow
```

(Upload as Lambda layer or zip deployment)

---

### 6️⃣ Configure API Gateway

* Method: POST
* Enable CORS
* Endpoint example:

```
https://your-api-id.execute-api.region.amazonaws.com/prod/upload
```

---

### 7️⃣ Update Frontend Config

In `script.js`:

```javascript
const API_URL = "YOUR_API_GATEWAY_URL";
const BUCKET = "processed-images-bucket-togi-001";
```

---

### 8️⃣ Run Locally

Use Live Server or open `index.html`:

```
127.0.0.1:5500
```

---

## 🔄 Workflow Explained

1. User selects image from UI
2. Image converted to Base64 in browser
3. Sent to API Gateway
4. Lambda uploads to input S3 bucket
5. S3 triggers image-processor Lambda
6. Image is resized into 3 sizes
7. Stored in processed S3 bucket
8. UI generates download links

---

## 📥 Output Example

```
processed-images-bucket/
├── thumbnails/resized-xyz.jpg
├── medium/resized-xyz.jpg
├── large/resized-xyz.jpg
```

---

## ⚠️ Common Issues & Fixes

### ❌ AccessDenied Error

✔ Fix: Add public bucket policy to processed bucket

---

### ❌ Image not appearing

✔ Check:

* Correct S3 URL format
* Region in URL
* Bucket policy

---

### ❌ Upload failed

✔ Check:

* API Gateway CORS enabled
* Lambda logs (CloudWatch)

---

### ❌ Image not resizing

✔ Check:

* S3 trigger configured
* Lambda permissions

---

## 💡 Future Enhancements

* 📦 Download all sizes as ZIP
* 📊 Progress bar during upload
* 🧾 Image metadata preview
* 🔐 Private images with signed URLs
* 🌐 Deploy frontend on AWS S3 + CloudFront

---

## 👨‍💻 Author

**Togi Varprasad Rao**

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
