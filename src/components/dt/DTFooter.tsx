const footerLinks = [
  { name: "Home", href: "#hero" },
  { name: "Products", href: "#products" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
  { name: "Privacy", href: "/privacy" },
];

const DTFooter = () => {
  const handleLinkClick = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-border py-10 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📞</span>
              <span className="font-bold text-lg text-foreground">AI Drive-Through</span>
            </div>
            <p className="text-muted-foreground text-xs leading-snug mb-2">
              AI-powered lead recovery for local businesses.
            </p>
            <p className="text-muted-foreground text-xs leading-snug">
              AI receptionist · Smart website · Lead capture · UK support
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground text-sm mb-3">Quick Links</h4>
            <ul className="space-y-1 flex flex-wrap gap-x-6 gap-y-1">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith("#") ? (
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300 bg-transparent border-0 cursor-pointer p-0 min-h-0"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © 2026 AI Drive-Through by Entreprenuity. All rights reserved.
          </p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <a
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors text-xs"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DTFooter;
