# 🎯 Quick Start Guide - GitHub Integration

## ✅ Implementation Complete!

### What's New in Your Dashboard

#### 1️⃣ **Top Stats Bar** (4 Cards)
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Active PRs   │  Total Repos │ Pending      │ Processed    │
│    3 🟢     │     12 🔵   │  Reviews     │   45 ✅     │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

#### 2️⃣ **Refresh Button**
```
                    [🔄 Refresh GitHub Data]
```

#### 3️⃣ **Active PRs Table** (Priority Section)
```
┌─────────────────────────────────────────────────────────────┐
│  🟢 Active Pull Requests                    [Refresh]       │
├───────────────┬───────────────┬──────────┬──────┬──────────┤
│ REPOSITORY    │ PR TITLE      │ STUDENT  │ TIME │ ACTION   │
├───────────────┼───────────────┼──────────┼──────┼──────────┤
│ student1-pr   │ Add auth      │ john     │ 2h   │ [Review] │
│ student2-pr   │ Fix bug       │ jane     │ 5h   │ [Review] │
│ student3-pr   │ Update docs   │ alex     │ 1d   │ [Review] │
└───────────────┴───────────────┴──────────┴──────┴──────────┘
```

#### 4️⃣ **Repositories Grid** (Below PRs)
```
┌─────────────────────────────────────────────────────────────┐
│  🔵 All Repositories                        [Refresh]        │
│                                                              │
│  🔍 [Search repositories...]                                │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ student1-pr  │  │ student2-pr  │  │ student3-pr  │     │
│  │ ● JavaScript │  │ ● TypeScript │  │ ● Python     │     │
│  │ Jan 19, 2026 │  │ Jan 18, 2026 │  │ Jan 19, 2026 │     │
│  │ [Grade This] │  │ [Grade This] │  │ [Grade This] │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 How to Test

### Step 1: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev
# ✅ Server running on port 3000

# Terminal 2 - Frontend
cd frontend
npm run dev
# ✅ Frontend running on port 5173
```

### Step 2: Open Dashboard
```
http://localhost:5173/dashboard
```

### Step 3: What You'll See

**IF GitHub is configured** (GITHUB_TOKEN + GITHUB_ORG_NAME in .env):
- ✅ Real PR data from your organization
- ✅ Real repository list
- ✅ Stats show actual counts

**IF GitHub is NOT configured** (or API fails):
- ⚠️ Mock data displays (3 sample PRs, 4 sample repos)
- ✅ Everything still works!
- ✅ Frontend never breaks

---

## 🎮 Interactive Features

### Test These Actions:

#### ✅ View Active PRs
1. See list of open PRs in table
2. Click **"Review"** → Opens GitHub PR in new tab
3. Click **"Refresh"** → Reloads latest data

#### ✅ Browse Repositories
1. Scroll down to repo grid
2. Type in search bar → Filters results
3. Click **"Grade This"** → Goes to grading page (repo URL pre-filled!)
4. Click **GitHub icon** → Opens repo in new tab

#### ✅ Grade a Repository
1. From RepoList, click **"Grade This"**
2. Notice: Repo URL is already filled!
3. Enter student name
4. Select module number
5. Submit → Get grading results

#### ✅ Refresh Data
- Click top **"Refresh GitHub Data"** button
- Watch spinner animation
- Data updates

---

## 📊 API Responses

### Your Backend Returns:

**Successful Response:**
```json
{
  "success": true,
  "source": "github",  // ← Live data
  "count": 3,
  "data": [...]
}
```

**Fallback Response (if GitHub fails):**
```json
{
  "success": true,
  "source": "mock",  // ← Sample data
  "count": 3,
  "data": [...]
}
```

Frontend handles both seamlessly!

---

## 🎨 UI Walkthrough

### Stats Cards (Top)
- **Active PRs**: Shows PR count with green icon
- **Total Repos**: Shows repo count with blue icon
- **Pending Reviews**: Your existing review system
- **Processed**: Click to view history (existing feature)

### Active PRs Table
- **Repository**: Bold mono font for repo names
- **PR Title**: Truncated if too long
- **Student**: Avatar initial + name
- **Time**: "2 hours ago", "5 minutes ago"
- **Labels**: Up to 2 labels shown
- **Action**: Green "Review" button → Opens PR

### Repositories Grid
- **Search Bar**: Real-time filtering
- **Cards**: 3 columns on desktop, responsive
- **Language Badge**: Colored dot + language name
- **Last Updated**: Formatted date
- **Grade This**: Green button → Navigate to grading
- **GitHub Link**: Gray button → Open on GitHub

---

## 🔧 Configuration

### Backend (.env)
```env
GITHUB_TOKEN=ghp_your_token_here
GITHUB_ORG_NAME=metana  # ← Your org name
```

### Get GitHub Token:
1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `read:org`
4. Copy token to .env

---

## 🎯 User Flow

```
Student pushes code
    ↓
PR created on GitHub
    ↓
Dashboard shows PR in "Active PRs" table
    ↓
Instructor clicks "Review" → GitHub opens
    OR
Instructor goes to Repositories section
    ↓
Searches for student repo
    ↓
Clicks "Grade This"
    ↓
Grading page opens with repo URL pre-filled
    ↓
Instructor grades submission
```

---

## ✅ Testing Checklist

Run through this checklist:

- [ ] Open dashboard → Stats show numbers
- [ ] See Active PRs table (or "All caught up!")
- [ ] Click "Review" → GitHub PR opens
- [ ] See Repositories grid (or empty state)
- [ ] Type in search → Results filter
- [ ] Click "Grade This" → Navigate to grading
- [ ] Verify repo URL is pre-filled
- [ ] Click "Refresh GitHub Data" → See spinner
- [ ] Check dark mode works
- [ ] Test on mobile (responsive)

---

## 🐛 Common Issues

### Issue: No data showing
**Solution**: 
- Check backend is running (port 3000)
- Check browser console for errors
- Data might be using mock mode (expected if GitHub not configured)

### Issue: "Review" button doesn't work
**Solution**:
- Check PR URL is valid
- Make sure it's opening in new tab
- Verify `target="_blank"` attribute

### Issue: "Grade This" doesn't navigate
**Solution**:
- Verify react-router-dom is installed
- Check `/grading` route exists in App.jsx
- Make sure useNavigate is imported

### Issue: Search not filtering
**Solution**:
- Type in the search box (not browser search)
- Check case-insensitive matching
- Verify filteredRepos logic

---

## 📈 What's Next?

### Optional Enhancements:
1. **Add PR Filters**: By label, author, date
2. **Add Sorting**: Sort repos by name, date, language
3. **Add Pagination**: For 100+ repos
4. **Add Notifications**: Toast on data refresh
5. **Add PR Status**: Draft vs Ready for Review
6. **Add Bulk Actions**: Grade multiple repos at once

---

## 🎉 Success!

Your dashboard now has:
- ✅ Real-time GitHub PR monitoring
- ✅ Complete repository overview
- ✅ Seamless grading integration
- ✅ Professional UI/UX
- ✅ Robust error handling
- ✅ Mock mode fallback

**Everything works together perfectly!** 🚀

---

## 💡 Pro Tips

1. **Use Search**: Filter repos by typing student names
2. **Bookmark Dashboard**: Set as homepage for quick access
3. **Enable Notifications**: Browser notifications when new PRs arrive (future feature)
4. **Check Stats Daily**: Monitor active PR count
5. **Use Refresh**: Click before starting grading session

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check backend terminal for errors
3. Verify .env configuration
4. Test with mock data first (no GitHub token)
5. Review [FRONTEND_GITHUB_INTEGRATION.md](FRONTEND_GITHUB_INTEGRATION.md)

---

## 🏆 You're All Set!

Start grading with confidence! Your dashboard is now a powerful tool for managing student submissions.

Happy grading! 📚✨
