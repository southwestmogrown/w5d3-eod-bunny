class Spritesheet {
    constructor(imageUrl, frameWidth, frameHeight, columns) {
        this.imageUrl = imageUrl;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.columns = columns;
        this.image = null;
    }
    addImageToDOM(elementToAddTo = document.body) {
        const newImgElement = document.createElement("div");
        newImgElement.style.background = `url(${this.imageUrl}) 0 0`;
        newImgElement.style.width = `${this.frameWidth}px`;
        newImgElement.style.height = `${this.frameHeight}px`;
        this.image = newImgElement;
        elementToAddTo.appendChild(newImgElement);
    }
    goToFrame(frameIndex) {
        const xPosition = (frameIndex % this.columns) * this.frameWidth;
        const yPosition = (Math.floor(frameIndex / this.columns)) * this.frameHeight;
        this.image.style.background = `url(${this.imageUrl}) ${xPosition * -1}px ${yPosition * -1}px`;
    }
}

class AnimatedSpritesheet extends Spritesheet {
    constructor(imageUrl, frameHeight, frameWidth, columns) {
        super(imageUrl, frameHeight, frameWidth, columns); // What is super? it invokes the constructor of the parent class
        // WITH THE SAME THIS as this function
        this.registeredAnimations = {};
        this.currentlyPlayingAnimation = null;
    }
    registerAnimation(label, start, end) {
        this.registeredAnimations[label] = { startFrame: start, endFrame: end };
    }
    playAnimation(label) {

        if (this.currentlyPlayingAnimation) {
            this.stopAnimation();
        }
       
        const chosenAnimation = this.registeredAnimations[label];
        if (!chosenAnimation) {
            throw new Error(`Unknown animation ${label}`);
        }
        let currentFrame = chosenAnimation.startFrame;
        this.currentlyPlayingAnimation = setInterval(() => {
            this.goToFrame(currentFrame);
            currentFrame = currentFrame + 1;
            if (currentFrame > chosenAnimation.endFrame) {
                currentFrame = chosenAnimation.startFrame;
            }
        }, 100);
    }
    stopAnimation() {
        clearInterval(this.currentlyPlayingAnimation);
        this.currentlyPlayingAnimation = null;
    }
}

window.addEventListener("DOMContentLoaded", () => {

    const bunnySprite = new AnimatedSpritesheet(
        "/assets/bunny.png",
        220 / 4,
        444 / 6,
        4
    );

    bunnySprite.addImageToDOM(document.getElementById("app"));

    bunnySprite.registerAnimation("idle", 0, 1);
    bunnySprite.registerAnimation("run", 8, 13);

    bunnySprite.playAnimation("idle");

    setTimeout(() => {
        bunnySprite.playAnimation("run");
    }, 5000);
    
});