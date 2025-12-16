# Full Stack Technical Test - KOL Analytics Dashboard

**Duration**: 4 hours | **Level**: 3+ years experience

**Stack**: React 18+ / TypeScript / TailwindCSS + Python / FastAPI

> **Goal**: This test evaluates what you can build in 4 hours. We're assessing your development process, architectural decisions, and code quality - not perfection. Focus on demonstrating your skills within the time constraint.

---

## The Challenge

Build an analytics dashboard for Key Opinion Leader (KOL) data in the medical/pharmaceutical space. You'll create both a visualization frontend and a REST API backend.

**Provided**: `mockKolData.json` containing ~50 KOLs with fields: name, country, affiliation, expertise area, publications count, h-index, citations.

(Also available as `mockKolData.ts` and an Excel file for bonus parsing)

---

## What to Build

### Backend (FastAPI)

Create a REST API that:

- Serves KOL data from the provided JSON (or parse the Excel file for bonus points)
- Exposes endpoints:
  - `GET /api/kols` — List KOLs
  - `GET /api/kols/{id}` — Single KOL
  - `GET /api/kols/stats` — Aggregate statistics (totals, averages, distributions)
- Uses Pydantic models for request/response validation
- Handles errors gracefully (404, 500)
- Configures CORS for local frontend development

### Frontend (React + TypeScript)

Create a dashboard that:

- Displays summary stats (total KOLs, publications, countries represented, avg h-index)
- Shows an interactive bar chart of top 10 countries by KOL count
  - Tooltip on hover
  - Use any visualization library you're comfortable with
- Manages state with Context API + custom hooks
- Fetches all data from your API (no hardcoded data in production)
- Handles loading and error states
- Is fully typed (strict TypeScript, no `any`)
- Is styled with TailwindCSS and responsive

---

## 🔍 Data Analysis Task

Analyze the provided data and include brief comments in your code:
- Which KOL has the highest citations-to-publications ratio and why might this be significant?
- What data quality issues do you observe in the dataset?

(Demonstrates analytical thinking beyond implementation)

---

## Evaluation Criteria

| Area               | What We're Looking For                                     |
|--------------------|------------------------------------------------------------|
| Architecture       | Clean separation of concerns, logical file structure       |
| TypeScript         | Strict types, well-defined interfaces, no shortcuts        |
| API Design         | RESTful conventions, proper validation, error handling     |
| Data Visualization | Functional chart with interactivity, readable code         |
| State Management   | Effective use of Context/hooks, performance considerations |
| Code Quality       | Readable, maintainable, appropriately commented            |

**We value quality over quantity.** A polished core solution beats a rushed attempt at extras.

---

## Bonus Opportunities

If you finish early and want to demonstrate senior-level skills, consider:

- **Raw D3.js** implementation instead of a wrapper library
- **Advanced filtering** (search, multi-select dropdowns, range sliders)
- **Second visualization** (pie chart, scatter plot, sortable table)
- **Backend pagination/filtering/sorting** with query parameters
- **Excel parsing** instead of JSON loading

**Note**: Bonus features are weighted in evaluation but entirely optional. Only attempt after the core is solid.

---

## Deliverables

1. **Working code** — Both frontend and backend should run
2. **README.md** with:
   - Setup instructions (how to run both services)
   - Architecture decisions and tradeoffs
   - What you'd improve with more time
   - Time spent (be honest — helps us calibrate)
3. **Git history** — Commit as you go with clear messages

---

## Quick Tips

- Define your TypeScript types first
- Get end-to-end flow working before adding features
- Use FastAPI's `/docs` to test endpoints as you build
- Debounce search inputs for better performance
- Clean up `useEffect` hooks (especially with D3.js) to prevent memory leaks
- Optimize re-renders with `useMemo`/`useCallback` where appropriate
- Check responsive behavior periodically
- Zero console errors in final submission

---

**Questions?** Focus on building something you'd be proud to show in a code review. Good luck! 🚀
