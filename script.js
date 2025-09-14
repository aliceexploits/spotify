// 🔑 Configura tus datos de Spotify
const clientId = "c8e8431627634e3f8bee8f9075185c73";
const redirectUri = "https://aliceexploits.github.io/spotify/";
const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;


// Botón de login
document.getElementById("login-btn")?.addEventListener("click", () => {
  const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes)}`;
  window.location.href = url;
});

// Obtener token de la URL después del login
function getTokenFromUrl() {
  const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce((acc, item) => {
      if (item) {
        const parts = item.split("=");
        acc[parts[0]] = decodeURIComponent(parts[1]);
      }
      return acc;
    }, {});
  return hash.access_token;
}

let token = getTokenFromUrl();
if (token) {
  window.location.hash = ""; // limpia la URL
  loadUserPlaylists(token);
  loadTopTracks(token); // 🚀 Cargar top tracks
}

// 🔹 Elementos DOM
const playlistContainer = document.getElementById("playlist-container");
const tracksScreen = document.getElementById("tracks-screen");
const tracksContainer = document.getElementById("tracks-container");
const playlistTitle = document.getElementById("playlist-title");
const backBtn = document.getElementById("back-btn");
const player = document.getElementById("player");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const topTracksContainer = document.getElementById("top-tracks-container");

// 🚀 Cargar playlists del usuario desde Spotify
async function loadUserPlaylists(token) {
  const res = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: { Authorization: "Bearer " + token },
  });
  const data = await res.json();
  displayPlaylists(data.items);
}

// Función para mostrar playlists en pantalla principal
function displayPlaylists(playlists) {
  playlistContainer.innerHTML = "";
  playlists.forEach((pl) => {
    const btn = document.createElement("button");
    btn.className =
      "flex items-center gap-3 p-2 bg-white/50 rounded-xl hover:bg-sky-100 transition w-full";

    btn.innerHTML = `
      <img src="${pl.images[0]?.url || ""}" class="w-12 h-12 rounded-lg">
      <span class="text-gray-800 font-semibold">${pl.name}</span>
    `;

    btn.addEventListener("click", () => loadTracks(pl.id, pl.name));
    playlistContainer.appendChild(btn);
  });
}

// Función para cargar canciones de una playlist
async function loadTracks(playlistId, name) {
  playlistContainer.parentElement.classList.add("hidden");
  tracksScreen.classList.remove("hidden");

  playlistTitle.textContent = name;
  tracksContainer.innerHTML = "";
  player.classList.add("hidden"); // ocultar reproductor hasta seleccionar canción

  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: { Authorization: "Bearer " + token },
    }
  );
  const data = await res.json();

  data.items.forEach((item) => {
    const track = item.track;
    const trackBtn = document.createElement("button");
    trackBtn.className =
      "flex items-center gap-3 p-2 bg-white/50 rounded-xl hover:bg-sky-100 transition w-full";

    trackBtn.innerHTML = `
      <img src="${track.album.images[0]?.url || ""}" class="w-12 h-12 rounded-lg">
      <div class="flex flex-col text-left">
        <span class="text-gray-800 font-semibold">${track.name}</span>
        <span class="text-gray-600 text-sm">${track.artists
          .map((a) => a.name)
          .join(", ")}</span>
      </div>
    `;

    trackBtn.addEventListener("click", () => playTrack(track));
    tracksContainer.appendChild(trackBtn);
  });
}

// Función para mostrar reproductor y actualizar info
function playTrack(track) {
  player.classList.remove("hidden");
  player.classList.add("animate-slideUp");

  cover.src = track.album.images[0]?.url || "";
  title.textContent = track.name;
  artist.textContent = track.artists.map((a) => a.name).join(", ");

  // 🎵 Aquí iría la integración con Spotify Web Playback SDK
}

// Botón volver a playlists
backBtn.addEventListener("click", () => {
  tracksScreen.classList.add("hidden");
  playlistContainer.parentElement.classList.remove("hidden");
  player.classList.add("hidden");
});

// 🔹 Función para top tracks del usuario
async function fetchWebApi(endpoint, method = "GET", body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
  return await res.json();
}

async function loadTopTracks() {
  const data = await fetchWebApi(
    "v1/me/top/tracks?time_range=long_term&limit=5"
  );
  if (!topTracksContainer) return;

  topTracksContainer.innerHTML = "";
  data.items?.forEach((track) => {
    const div = document.createElement("div");
    div.textContent = `${track.name} - ${track.artists
      .map((a) => a.name)
      .join(", ")}`;
    topTracksContainer.appendChild(div);
  });
}

// 🔹 Playlist embed
const playlistId = "4Lu5QFKbaDRhwyReIlItqP";
const embedContainer = document.getElementById("embed-container");
if (embedContainer) {
  embedContainer.innerHTML = `
    <iframe
      title="Spotify Embed: Recommendation Playlist"
      src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0"
      width="100%"
      height="360"
      frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  `;
}

