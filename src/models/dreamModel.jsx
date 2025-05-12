export default class Dream {
  constructor(title, description, mood) {
    this.title = title;
    this.description = description;
    this.mood = mood; // Enum: happy, sad, inspired, etc.
  }


  static isValid(dream, mood) {
    if (!dream.title || dream.title.length < 3) {
      return { valid: false, error: "Title is required and should be at least 3 characters long." };
    }
    return { valid: true };
  }
}
