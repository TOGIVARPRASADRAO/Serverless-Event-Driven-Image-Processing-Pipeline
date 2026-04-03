const API_URL = "https://kgzj3fvzke.execute-api.eu-north-1.amazonaws.com/prod/upload";
const BUCKET = "processed-images-bucket-togi-001";

let selectedFile = null;

// 🔥 Show file name in drag box
function handleFileSelect(event) {
    selectedFile = event.target.files[0];

    if (selectedFile) {
        document.getElementById("fileName").innerText = "📄 " + selectedFile.name;
    }
}

// 🔥 Upload function
async function uploadImage() {
    const status = document.getElementById("status");
    const result = document.getElementById("result");

    if (!selectedFile) {
        alert("Please select a file");
        return;
    }

    const reader = new FileReader();

    reader.onload = async function () {
        try {
            status.innerText = "Uploading & Processing... ⏳";

            const base64 = reader.result.split(",")[1];

            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ file: base64 })
            });

            const data = await res.json();

            if (res.ok) {
                status.innerText = "✅ Uploaded & Processed!";

                const fileName = data.file_name;

                // 🔥 Processed image URLs
                const thumbnail = `https://${BUCKET}.s3.eu-north-1.amazonaws.com/thumbnails/resized-${fileName}`;
                const medium = `https://${BUCKET}.s3.eu-north-1.amazonaws.com/medium/resized-${fileName}`;
                const large = `https://${BUCKET}.s3.eu-north-1.amazonaws.com/large/resized-${fileName}`;

                // ✅ SHOW ONLY FILE NAME + BUTTONS (NO IMAGE)
                result.innerHTML = `
                    <p style="margin-top:10px; font-weight:bold;">
                        📄 ${selectedFile.name}
                    </p>

                    <div style="margin-top:15px;">
                        <button onclick="downloadImage('${thumbnail}')">⬇ Thumbnail</button>
                        <button onclick="downloadImage('${medium}')">⬇ Medium</button>
                        <button onclick="downloadImage('${large}')">⬇ Large</button>
                    </div>
                `;
            } else {
                status.innerText = "❌ Upload Failed";
                console.error(data);
            }

        } catch (error) {
            console.error(error);
            status.innerText = "❌ Error uploading";
        }
    };

    reader.readAsDataURL(selectedFile);
}

// 🔥 Download function
function downloadImage(url) {
    fetch(url)
        .then(res => res.blob())
        .then(blob => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "image.jpg";
            link.click();
        })
        .catch(() => alert("Download failed"));
}