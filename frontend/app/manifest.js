export default function manifest() {
  return {
    name: "Samvidhan Setu",
    short_name: "Setu",
    description: "A bridge between citizens and the Constitution of India.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f7fb",
    theme_color: "#1f3fbf",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
