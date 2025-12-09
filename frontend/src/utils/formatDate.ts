export  const formatDate = (date: any) => {
    if (!date) return '';
    // Check if it's a Firestore Timestamp (has .seconds)
    if (typeof date === 'object' && 'seconds' in date) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    // Otherwise treat as standard Date/String
    return new Date(date).toLocaleDateString();
  };