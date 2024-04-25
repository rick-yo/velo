import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Velo",
  description: "Get insights of your website's performance",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Get Started", link: "/documentation" },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/rick-you/velo" }],
    logo: "logo.svg",
  },
});
