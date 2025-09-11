require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// User serialization
passport.serializeUser((user, done) => {
  // Serialize user ID to the session
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // TODO: Fetch user from DB by ID
  // Example:
  // User.findById(id).then(user => done(null, user)).catch(err => done(err));
  done(null, { id }); // Placeholder: replace with real user object
});

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    // TODO: Replace with your DB logic
    // Example:
    // let user = await User.findOne({ googleId: profile.id });
    // if (!user) {
    //   user = await User.create({
    //     googleId: profile.id,
    //     name: profile.displayName,
    //     email: profile.emails[0].value,
    //     // ...other fields
    //   });
    // }
    // return done(null, user);

    // Placeholder logic:
    const user = { id: profile.id, name: profile.displayName, email: profile.emails[0].value };
    return done(null, user);
  }
));

// Route to start OAuth flow
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// OAuth callback route
app.get('/api/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login', // Change as needed
    successRedirect: '/dashboard', // Change as needed
  })
);

// Example protected route
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello, ${req.user.name || 'User'}!`);
  } else {
    res.redirect('/login');
  }
});

// Example login page
app.get('/login', (req, res) => {
  res.send('Login failed or not authenticated. <a href="/api/auth/google">Try Google Login</a>');
});

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Start server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
