export const firebaseErrorMessage = (code) => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try logging in.';

    case 'auth/user-not-found':
      return 'No account found with this email.';

    case 'auth/wrong-password':
      return 'Incorrect password. Try again.';

    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled. Please try again.';

    case 'auth/network-request-failed':
      return 'Network error! Check your internet connection.';

    default:
      return 'Something went wrong! Please try again.';
  }
};
