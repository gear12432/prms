# phoneG — Coin Buy & Coin Send Application

**phoneG** is a full-stack, mobile-first fintech web application for buying, sending, and receiving digital coins with real-time wallet updates, Firebase Authentication, Cloud Firestore data persistence, Firebase Storage document uploads, and identity verification (KYC).

---

## 🚀 Key Features

1. **Splash / Welcome Screen**:
   - Animated wallet illustration and quick "Get Started" onboarding.
2. **Login & Registration Screen**:
   - Secure authentication supporting public User IDs (e.g. `PL18753`) or Gmail IDs.
3. **Three-Step Registration Wizard**:
   - **Step 1: Personal Details** (Name, Mobile, Gmail, Password with validation).
   - **Step 2: KYC Details** (PAN Card, Aadhaar Card, Document uploads with preview, replace & remove options).
   - **Step 3: Address Details** (Full address with Indian States & Districts mapping, PIN Code, City).
4. **Unique User ID Generation**:
   - Automatic server-validated public User ID (`PL` + 5 unique digits e.g. `PL18753`) and canonical Firebase Auth UID.
5. **Registration Success Popup**:
   - Animated checkmark modal displaying User ID and UID with one-click copy buttons and welcome bonus.
6. **Home Dashboard**:
   - Total Coin Balance, INR conversion value (1 Coin = ₹10), Quick Actions grid, and Real-time Activity feed.
7. **Buy Coins**:
   - Coin selection, INR fee calculation, payment gateway integration points (UPI, Cards, Net Banking).
8. **Send Coins**:
   - Recipient User ID lookup, verification badge, atomic transaction processing with balance validation.
9. **Receive Coins**:
   - Dedicated QR code generation, shareable payment link, and one-click User ID copy.
10. **Transaction History**:
    - Filterable history tab (All, Bought, Sent, Received) with search bar and transaction details modal.
11. **KYC Status & Profile**:
    - Complete user profile, address details, and document verification status.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, QRCode SVG.
- **Backend**: Firebase Authentication, Cloud Firestore Database, Firebase Storage.
- **Serverless**: Firebase Cloud Functions (Node.js/TypeScript) for authoritative transactions.
- **Build Tool**: Vite.
- **CI/CD**: GitHub Actions workflow (`.github/workflows/deploy.yml`) for deployment to GitHub Pages.

---

## 📁 Project Structure

```
phoneg-app/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD workflow
├── firebase/
│   ├── firestore.rules          # Firestore Security Rules
│   ├── firestore.indexes.json    # Query Indexes
│   └── storage.rules            # Firebase Storage Security Rules
├── functions/
│   ├── src/
│   │   └── index.ts            # Cloud Functions for coin transfer
│   ├── package.json
│   └── tsconfig.json
├── public/
├── src/
│   ├── components/
│   │   ├── auth/                # LoginForm, PasswordInput, TermsCheckbox
│   │   ├── common/              # AppHeader, AppButton, AppInput, LoadingOverlay, CircularProgress, ToastMessage, ConfirmDialog, ProtectedRoute
│   │   ├── dashboard/           # WalletBalanceCard, QuickActions, RecentTransactions
│   │   ├── registration/        # RegistrationStepper, PersonalDetailsForm, KycDetailsForm, AddressDetailsForm, DocumentUpload, RegistrationSuccessModal
│   │   └── wallet/              # BuyCoinsForm, SendCoinsForm, ReceiveCoinsCard, TransactionList
│   ├── contexts/                # AuthContext, WalletContext
│   ├── hooks/                   # useAuth, useWallet, useFirestoreDocument
│   ├── layouts/                 # AuthLayout, MainLayout
│   ├── lib/                     # firebaseErrors, validators, formatters, constants
│   ├── pages/                   # SplashPage, LoginPage, RegisterPage, HomePage, BuyCoinsPage, SendCoinsPage, ReceiveCoinsPage, TransactionsPage, ProfilePage, KycStatusPage, NotFoundPage
│   ├── routes/                  # AppRoutes
│   ├── services/                # firebase, authService, userService, kycService, storageService, walletService, transactionService
│   ├── types/                   # user, kyc, wallet, transaction
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── firebase-applet-config.json  # Environment Firebase configuration
├── firebase-blueprint.json       # Intermediate schema representation
├── firebase.json                # Firebase configuration
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🔒 Security & Firebase Configuration

- **Centralized Firebase Initialization**: Initialized in `src/services/firebase.ts` using `firebase-applet-config.json`.
- **Firestore Security Rules**: Deny-by-default rules defined in `firebase/firestore.rules` preventing unauthorized user profile edits and client balance tampering.
- **Firebase Storage Rules**: Restricts document photos (`kyc/{userId}/*`) strictly to the authenticated owner UID.

---

## 📦 How to Upload & Deploy via GitHub

### Option 1: Automatic GitHub Actions Deployment (Recommended)
1. Push this repository to your GitHub account on the `main` branch.
2. In GitHub Repository Settings -> **Pages**, set **Source** to **GitHub Actions**.
3. Every commit to `main` will automatically build and publish the applet to GitHub Pages.

### Option 2: Upload Files via GitHub Website
1. Create a new repository on GitHub (e.g. `phoneg-app`).
2. Click **Add file** -> **Upload files**.
3. Drag and drop all files and folders from this project into the upload area.
4. Commit the changes to `main`.
5. Under Repository **Settings** -> **Pages**, select `main` branch `/root` directory and Save.

---

## 🧪 Local Development & Build

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```
