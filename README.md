# 📄 CV-Builder v1.2.0

A premium, state-of-the-art curriculum vitae builder designed for professionals who value both design and efficiency. Create high-end, ATS-ready resumes with real-time preview and intuitive local management.

## ✨ Core Features

### 🎨 Visual Customization

- **Dynamic Themes**: Choose from a curated selection of master themes (Classic Burgundy, Midnight Blue, Modern Teal, etc.).
- **Advanced Layouts**: Support for Balanced 2-Column, Side-Left, Side-Right, and Single Column structures.
- **Color Harmony**: Full control over primary colors, accent colors, contact bars, and text colors.
- **Typography Control**: Fine-tuned font size adjustments for headers, summaries, and content.

### 🛠️ Premium Editing Experience

- **Smart Date Pickers**: Custom-built date range pickers with integrated "Present" status toggle and minimal manual text override.
- **Drag & Drop Reordering**: Native HTML5 reordering for experiences, education, certifications, skills, and interests.
- **Profile Identity**: Easy profile image upload with automatic layout adaptation (adapts profile summary width when the image is hidden).

### 💾 Data Management & Security

- **Local Persistence**: All resume data is stored securely in your browser's IndexedDB.
- **Multi-Resume Support**: Create, duplicate, and manage multiple versions of your CV.
- **Import/Export**: Full JSON backup/restore capabilities and AI-ready .txt import for quick data parsing.
- **Dark Mode**: Fully implemented dark mode for a comfortable late-night editing experience.

### 🖨️ Professional Output

- **PDF Export**: Generate high-quality, ATS-ready PDFs using integrated `jsPDF` and `html2canvas`.
- **A4/Letter Standard**: Optimized for standard printing formats with professional spacing.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository** (or download files).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📜 Changelog

### v1.2.0 (Current)

- **Fix**: Resolved React 'unique key prop' warnings in Resume lists.
- **Fix**: Fixed eye icon in Column Manager to correctly toggle section visibility.
- **Feat**: Added company description and contact details fields.
- **UI**: Added translations and multi-language support.
- **Fix**: Prevented inline edits from being reverted during autosave.

### v1.1.0

- **Feat**: Introduced native HTML5 Drag & Drop reordering for all list components.
- **Feat**: Redesigned `DateRangePicker` with custom state toggles and premium look.
- **UI**: Added "Type" icon minimal toggle for manual date/period entry.
- **UX**: Reorganized visual settings into a responsive 2-column grid.
- **Fix**: Improved profile image adaptation logic for the professional summary.

### v1.0.0

- **Feat**: Initial release with core CV editing functionality.
- **Feat**: IndexedDB persistent storage implementation.
- **Feat**: Multiple resume management.
- **Feat**: Basic PDF export functionality.

## 🛠️ Technology Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Modern Flex/Grid system)
- **Icons**: Lucide React
- **PDF Generation**: jsPDF & html2canvas

## 🤝 Contributing

Feel free to fork this project and submit PRs with improved resume templates or new layout structures.

---

<div align="center">
  Built with ❤️ for professionals.
</div>
