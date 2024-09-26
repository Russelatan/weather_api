import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["search"];

  connect() {
    // Event listener for keydown events
    document.addEventListener("keydown", this.handleKeydown.bind(this));
  }

  // Method to handle keydown event
  handleKeydown(event) {
    // Check if the pressed key is the space bar (key code 32 or ' ')
    if (event.keyCode === 32 || event.key === " ") {
      event.preventDefault(); // Prevent default space bar behavior (e.g., scrolling)
      this.onSpacePress();
    }
  }

  // Action to perform when space bar is pressed
  onSpacePress() {
    console.log("Space bar was pressed!");
    const search = this.searchTarget;
    search.classList.toggle("hidden");
  }

  // Optional: Disconnect event listener when the controller is disconnected
  disconnect() {
    document.removeEventListener("keydown", this.handleKeydown.bind(this));
  }
}
