# Olcademy Mini Food Ordering App

A React Native (Expo) starter showcasing a food ordering experience with Firebase Firestore integration. The app streams menu updates in real time, lets users curate a cart, and submits confirmed orders to Firestore.

## Highlights

- 📱 Clean, modern UI built with React Native components
- 🔄 Real-time menu updates via Firestore `onSnapshot`
- 🛒 Global cart management with the Context API + reducer pattern
- 🧾 Order confirmation workflow with calculated totals and Firestore persistence
- ✅ Strict TypeScript setup, modular architecture, and reusable UI components

## Project Structure

```
.
├── App.tsx
├── src
│   ├── components      # Reusable UI building blocks (cards, selectors, rows)
│   ├── context         # Cart context + reducer logic
│   ├── hooks           # Firestore data subscriptions (e.g., menu)
│   ├── navigation      # Native stack navigator
│   ├── screens         # Menu, cart, and order summary experiences
│   ├── services        # Firebase initialization and Firestore helpers
│   ├── theme           # Centralized design tokens
│   ├── types           # Shared TypeScript types
│   └── utils           # Formatting helpers
├── app.json            # Expo configuration
├── package.json
└── tsconfig.json
```

## Getting Started

1. **Install dependencies**
   ```powershell
   npm install
   ```

2. **Configure Firebase**
   - Create a Firebase project and enable Firestore (in Native/production mode).
   - Under **Build → Firestore Database**, create a `menu` collection and add a few documents. Example schema:
     ```json
     {
       "name": "Smoky Chipotle Burger",
       "description": "Grass-fed beef, smoked gouda, chipotle aioli, brioche bun",
       "price": 12.5,
       "imageUrl": "https://images.unsplash.com/photo-1550317138-10000687a72b",
       "category": "Burgers",
       "isAvailable": true
     }
     ```
   - (Optional) Set up a Cloud Firestore rule to allow reads and writes during development:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if request.auth != null;
         }
       }
     }
     ```
     Alternatively, enable anonymous auth or relax the rule temporarily while prototyping.

3. **Expose Firebase configuration**
   - Add an `.env` file in the project root (Expo automatically loads variables prefixed with `EXPO_PUBLIC_`).
     ```env
     EXPO_PUBLIC_FIREBASE_API_KEY=...
     EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
     EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
     EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
     EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
     EXPO_PUBLIC_FIREBASE_APP_ID=...
     ```
   - Restart the Expo server after editing environment variables.

4. **Run the app**
   ```powershell
   npm run start
   ```
   - Use the Expo Go app (Android/iOS) or run on an emulator/simulator via the Expo CLI prompts.

## Firestore Data Flow

- `src/services/firebase.ts` initializes the Firebase app and exposes a Firestore instance.
- `src/hooks/useMenu.ts` subscribes to Firestore using `onSnapshot`, keeping the menu list in sync with live updates.
- `src/services/orderService.ts` persists confirmed orders under the `orders` collection, storing a lean summary of items and totals.

## UI Walkthrough

1. **Menu Screen** (`MenuScreen`)
   - Loads menu items with realtime updates and handles loading/error states.
   - Items are displayed with imagery, description, and an add-to-cart CTA.
   - A floating cart pill appears once items are selected.

2. **Cart Screen** (`CartScreen`)
   - Lets users adjust quantities or remove items.
   - Shows live price calculations (subtotal, tax, total).
   - "Review order" navigates to the confirmation view.

3. **Order Summary** (`OrderSummaryScreen`)
   - Presents a detailed receipt of the order.
   - On submission, creates an order document in Firestore, clears the cart, and redirects to the menu.

## Extensibility Ideas

- Add authentication for personalized order history.
- Introduce categories with segmented controls or tabs.
- Persist cart state locally using Async Storage for offline continuity.
- Integrate push notifications for order status updates.
- Expand Firestore rules for production (per-user reads/writes, validation, etc.).

## Testing Suggestions

- Unit test cart reducer logic with Jest.
- Mock Firestore in tests using libraries like `@firebase/rules-unit-testing` or `firebase-mock`.
- Snapshot test UI components to ensure styling consistency.

---
Built with care using React Native, Expo, and Firebase to demonstrate end-to-end mobile UX craftsmanship.
