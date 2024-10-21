export const validateAnimalForm = (type: string, breed: string, name: string, birthDate: string) => {
    const errors: any = {};
    
    if (!type) errors.type = 'Type is required';
    if (!breed) errors.breed = 'Breed is required';
    if (!name) errors.name = 'Name is required';
    if (!birthDate) {
      errors.birthDate = 'Birth Date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      errors.birthDate = 'Birth Date must be in YYYY-MM-DD format';
    }
  
    return errors;
  };