const solitaireHTMLevels = [
    `<div class="story-mode-level-container" id="story-mode-level-1">
    <div class="story-mode-cards-container first-column first-column">
      <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
            position: relative;
            left: 0px;
            top: 0px;
          "></div>
      <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
            position: relative;
            left: 0px;
            top: 0px;
            scale: 0.983337 1;
          "></div>
    </div>
    <div class="story-mode-cards-container second-column">
      <div id="sol-slot-02<[07]" class="sol-slot card-element closed removed" style="
            position: relative;
            left: 0px;
            top: 0px;
          "></div>
      <div id="sol-slot-07" class="sol-slot card-element opened removed" style="
            position: relative;
            left: 0px;
            top: 0px;
            scale: 0.983337 1;
          "></div>
    </div>
    <div class="story-mode-cards-container third-column">
      <div id="sol-slot-03<[08]" class="sol-slot card-element closed removed" style="
            position: relative;
            left: 0px;
            top: 0px;
          "></div>
      <div id="sol-slot-08" class="sol-slot card-element opened removed" style="
            position: relative;
            left: 0px;
            top: 0px;
            scale: 0.983337 1;
          "></div>
    </div>
    <div class="story-mode-cards-container fourth-column">
      <div id="sol-slot-04<[09]" class="sol-slot card-element closed removed" style="
            position: relative;
            left: 0px;
            top: 0px;
          "></div>
      <div id="sol-slot-09" class="sol-slot card-element opened removed" style="
            position: relative;
            left: 0px;
            top: 0px;
            scale: 0.983337 1;
          "></div>
    </div>
    <div class="story-mode-cards-container fifth-column">
      <div id="sol-slot-05<[10]" class="sol-slot card-element closed removed" style="
            position: relative;
            left: 0px;
            top: 0px;
          "></div>
      <div id="sol-slot-10" class="sol-slot card-element opened removed" style="
            position: relative;
            left: 0px;
            top: 0px;
            scale: 0.983337 1;
          "></div>
    </div>
    <style>
      .story-mode-level-container {
        display: flex;
        justify-content: space-between;
        width: 80%;
      }

      .story-mode-cards-container {
        display: flex;
        flex-direction: column-reverse;
      }

      .story-mode-cards-container>.card-element:not(:first-child) {
        margin-bottom: -6vw;
      }

      .first-column>.card-element:not(:first-child) {
        transform: translate(30%);
      }

      .second-column>.card-element:not(:first-child) {
        transform: translate(15%);
      }

      .third-column>.card-element:not(:first-child) {
        /* transform: translate(0%); */
      }

      .fourth-column>.card-element:not(:first-child) {
        transform: translate(-15%);
      }

      .fifth-column>.card-element:not(:first-child) {
        transform: translate(-30%);
      }
    </style>
  </div>`,
    `<div class="story-mode-level-container" id="story-mode-level-2">
  <div class="story-mode-cards-container first-column">
    <div id="sol-slot-01<[02]" class="sol-slot card-element closed removed" style="
          position: relative;
          left: 0px;
          top: 0px;
        "></div>
    <div id="sol-slot-02<[03]" class="sol-slot card-element closed removed" style="
          position: relative;
          left: 0px;
          top: 0px;
        "></div>
    <div id="sol-slot-03" class="sol-slot card-element opened removed" style="
          position: relative;
          left: 0px;
          top: 0px;
          scale: 0.983337 1;
        "></div>
  </div>
  <div class="story-mode-cards-container second-column">
    <div id="sol-slot-04" class="sol-slot card-element opened removed" style="
          position: relative;
          left: 0px;
          top: 0px;
          scale: 0.983337 1;
        "></div>
  </div>
  <div class="story-mode-cards-container third-column">
    <div id="sol-slot-05" class="sol-slot card-element opened removed" style="
          position: relative;
          left: 0px;
          top: 0px;
          scale: 0.983337 1;
        "></div>
  </div>
  <div class="story-mode-cards-container fourth-column">
    <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
          position: relative;
          left: 0px;
          top: 0px;
          scale: 0.983337 1;
        "></div>
  </div>
  <div class="story-mode-cards-container fifth-column">
    <div id="sol-slot-07" class="sol-slot card-element opened removed" style="
          position: relative;
          left: 0px;
          top: 0px;
          scale: 0.983337 1;
        "></div>
  </div>
  <div class="story-mode-cards-container sixth-column">
    <div id="sol-slot-08<[09]" class="sol-slot card-element closed removed" style="
          position: relative;
          left: 0px;
          top: 0px;
        "></div>
    <div id="sol-slot-09<[10]" class="sol-slot card-element closed removed" style="
          position: relative;
          left: 0px;
          top: 0px;
        "></div>
    <div id="sol-slot-10" class="sol-slot card-element opened removed" style="
          position: relative;
          left: 0px;
          top: 0px;
          scale: 0.983337 1;
        "></div>
  </div>
  <style>
    .story-mode-level-container {
      display: flex;
      justify-content: space-between;
      width: 80%;
      margin-bottom: 11vh;
    }

    .story-mode-cards-container {
      display: flex;
      flex-direction: column-reverse;
    }

    .story-mode-cards-container>.card-element:not(:first-child) {
      margin-bottom: -6vw;
    }
    .first-column, .sixth-column{
      margin-bottom: -7vh;
    }
    .first-column>.card-element:not(:first-child) {
      transform: translate(30%);
    }
    .first-column>.card-element:last-child {
      transform: translate(60%);
    }

    .second-column {
      transform: translate(30%);
    }

    .third-column {
      transform: translate(10%);
    }

    .fourth-column {
      transform: translate(-10%);
    }

    .fifth-column {
      transform: translate(-30%);
    }

    .sixth-column>.card-element:not(:first-child) {
      transform: translate(-30%);
    }
    .sixth-column>.card-element:last-child {
      transform: translate(-60%);
    }
    @media screen and (orientation: portrait) {
      .story-mode-level-container {
        margin-bottom: 5vh;
      }

      .story-mode-cards-container>.card-element:not(:first-child) {
        margin-bottom: -10vw;
      }
      .first-column, .sixth-column{
        margin-bottom: -4vw;
      }
    }
  </style>
</div>`,
    `<div class="story-mode-level-container" id="story-mode-level-3">
<div class="story-mode-cards-container first-column">
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<div class="story-mode-cards-container second-column">
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<div class="story-mode-cards-container third-column">
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<div class="story-mode-cards-container fourth-column">
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<style>
  .story-mode-level-container {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin-bottom: 11vh;
  }

  .story-mode-cards-container {
    display: flex;
    flex-direction: column-reverse;
  }

  .story-mode-cards-container>.card-element:not(:first-child) {
    margin-bottom: -4vw;
  }
  .first-column>.card-element:not(:first-child) {
    transform: translate(50%);
  }
  .second-column{
    margin-right: -8vw;
  }
  .second-column>.card-element:not(:first-child) {
    transform: translate(-100%);
    margin-bottom: 0;
  }
  .second-column>.card-element:last-child {
    transform: translate(-50%);
    margin-bottom: -12vw;
  }
  .third-column>.card-element:not(:first-child) {
    transform: translate(100%);
    margin-bottom: 0;
  }
  .third-column>.card-element:last-child {
    transform: translate(50%);
    margin-bottom: -12vw;
  }
  .fourth-column>.card-element:not(:first-child) {
    transform: translate(-50%);
  }
  @media screen and (orientation: portrait) {
    .first-column>.card-element:not(:first-child),
    .fourth-column>.card-element:not(:first-child) {
      margin-bottom: -6vw;
    }
    .second-column>.card-element:last-child {
      margin-bottom: -17vw;
    }
    .third-column>.card-element:last-child {
      margin-bottom: -17vw;
    }
  }
</style>
</div>`,
    `<div class="story-mode-level-container" id="story-mode-level-4">
<div class="story-mode-cards-container first-column">
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<div class="story-mode-cards-container second-column">
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<div class="story-mode-cards-container third-column">
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<style>
  .story-mode-level-container {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin-bottom: 1vh;
  }

  .story-mode-cards-container {
    display: flex;
    flex-direction: column-reverse;
  }

  .story-mode-cards-container>.card-element:not(:first-child) {
    margin-bottom: -6.3vw;
  }
  .first-column>.card-element:nth-child(2) {
    transform: translate(50%);
  }
  .first-column>.card-element:nth-child(3) {
    transform: translate(100%);
  }
  .first-column>.card-element:nth-child(4) {
    transform: translate(150%);
  }
  .second-column>.card-element:nth-child(2) {
    margin-bottom: -4vw;
  }
  .third-column>.card-element:nth-child(2) {
    transform: translate(-50%);
  }
  .third-column>.card-element:nth-child(3) {
    transform: translate(-100%);
  }
  .third-column>.card-element:nth-child(4) {
    transform: translate(-150%);
  }
  @media screen and (orientation: portrait) {
    .story-mode-cards-container>.card-element:not(:first-child) {
      margin-bottom: -9.5vw;
    }
    .second-column>.card-element:nth-child(2) {
      margin-bottom: -5vw;
    }
  }
</style>
</div>`,
    `<div class="story-mode-level-container" id="story-mode-level-5">
<div class="story-mode-cards-container first-column">
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
</div>
<div class="story-mode-cards-container second-column">
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-01<[06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
</div>
<div class="story-mode-cards-container third-column">
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<style>
  .story-mode-level-container {
    display: flex;
    justify-content: center;
    width: 80%;
    margin-bottom: 11vh;
    position: relative;
  }

  .story-mode-cards-container {
    display: flex;
    flex-direction: column-reverse;
  }

  .story-mode-cards-container>.card-element:not(:first-child) {
    margin-bottom: 0.3vw;
  }
  .first-column{
    position: absolute;
    transform: rotate(45deg);
  }
  .first-column>.card-element:nth-child(2),
  .second-column>.card-element:nth-child(2) {
    margin-bottom: 6vw;
  }
  .second-column{
    position: absolute;
    transform: rotate(-45deg);
  }
  .third-column{
    margin-top: -2vw;
  }
  @media screen and (orientation: portrait) {
  .first-column>.card-element:nth-child(2),
  .second-column>.card-element:nth-child(2) {
    margin-bottom: 10vw;
  }
  }
</style>
</div>`,
    `<div class="story-mode-level-container" id="story-mode-level-1">
<div class="story-mode-cards-container first-column">
  <div id="sol-slot-01<[05,06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-02<[06,07]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
</div>
<div class="story-mode-cards-container second-column">
  <div id="sol-slot-03<[05,06]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
  <div id="sol-slot-04<[06,07]" class="sol-slot card-element closed removed" style="
        position: relative;
        left: 0px;
        top: 0px;
      "></div>
</div>
<div class="story-mode-cards-container third-column">
  <div id="sol-slot-05" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
  <div id="sol-slot-06" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
  <div id="sol-slot-07" class="sol-slot card-element opened removed" style="
        position: relative;
        left: 0px;
        top: 0px;
        scale: 0.983337 1;
      "></div>
</div>
<style>
  .story-mode-level-container {
    display: flex;
    justify-content: center;
    width: 80%;
    margin-bottom: 1vh;
    position: relative;
  }

  .story-mode-cards-container {
    display: flex;
    flex-direction: column-reverse;
  }

  .story-mode-cards-container>.card-element:not(:first-child) {
    margin-bottom: 0.3vw;
  }

  .first-column {
    position: absolute;
    transform: rotate(45deg);
  }

  .first-column>.card-element:nth-child(2),
  .second-column>.card-element:nth-child(2) {
    margin-bottom: 6vw;
  }

  .second-column {
    position: absolute;
    transform: rotate(-45deg);
  }

  .third-column {
    margin-top: -2vw;
  }

  @media screen and (orientation: portrait) {

    .first-column>.card-element:nth-child(2),
    .second-column>.card-element:nth-child(2) {
      margin-bottom: 10vw;
    }
  }
</style>
</div>`
]

export { solitaireHTMLevels }