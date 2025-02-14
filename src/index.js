import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { multiaddr } from "@multiformats/multiaddr";

let helia;
let fs;

async function initHelia() {
  helia = await createHelia({
    libp2p: {
      addresses: {
        listen: [multiaddr("/dns4/bootstrap.libp2p.io/tcp/443/wss")],
      },
      transports: [webSockets()],
      peerDiscovery: {
        autoDial: true, // ✅ Automatically connect to discovered peers
        bootstrap: {
          list: [
            multiaddr(
              "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZgBMjTezGAJN",
            ),
            multiaddr(
              "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
            ),
            multiaddr(
              "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
            ),
            multiaddr(
              "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
            ),
          ],
        },
      },
    },
  });

  fs = unixfs(helia);
  console.log(
    "✅ Helia node initialized and connected to IPFS bootstrap nodes.",
  );
}

async function addFile() {
  if (!helia) {
    alert("Helia is not initialized.");
    return;
  }

  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files.length) {
    alert("Please select a file first.");
    return;
  }

  const file = fileInput.files[0];
  const fileBuffer = await file.arrayBuffer();
  const cid = await fs.addFile({
    path: file.name,
    content: new Uint8Array(fileBuffer),
  });

  console.log("📌 Added file CID:", cid.toString());
  localStorage.setItem("lastCID", cid.toString());

  document.getElementById("output").innerHTML =
    `File added: <b>${cid.toString()}</b>`;
}

async function retrieveFile() {
  if (!helia) {
    alert("Helia is not initialized.");
    return;
  }

  const lastCID = localStorage.getItem("lastCID");
  if (!lastCID) {
    alert("No CID found in storage.");
    return;
  }

  try {
    const fileData = [];
    for await (const chunk of fs.cat(lastCID)) {
      fileData.push(...chunk);
    }

    const blob = new Blob([new Uint8Array(fileData)], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);

    document.getElementById("output").innerHTML =
      `Retrieved file: <a href="${url}" download="retrieved_file">Download</a>`;
  } catch (err) {
    console.error("❌ Error retrieving file:", err);
    alert("Failed to retrieve file.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addFileButton").addEventListener("click", addFile);
  document
    .getElementById("retrieveFileButton")
    .addEventListener("click", retrieveFile);
  initHelia(); // Initialize Helia when page loads
});
