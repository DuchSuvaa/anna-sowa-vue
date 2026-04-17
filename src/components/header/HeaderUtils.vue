<template>
  <div class="social">
    <a href="https://soundcloud.com/user-288051599" target="_blank"><img src="https://annasowa.pl/wp-content/themes/anna-sowa/img/soundcloud.png" alt="SoundCloud - link"></a>
    <a href="https://vimeo.com/user65772597" target="_blank"><img src="https://annasowa.pl/wp-content/themes/anna-sowa/img/vimeo.png" alt="Vimeo - link"></a>
    <a href="https://www.instagram.com/sowaanna67/" target="_blank"><img src="https://annasowa.pl/wp-content/themes/anna-sowa/img/instagram.png" alt="Instagram - link"></a>
    <a href="mailto:annasowa66@wp.pl" target="_blank"><img src="https://annasowa.pl/wp-content/themes/anna-sowa/img/mail.png" alt="Napisz do Anny"></a>
    <a href="https://annasowa.pl/pl" class="lang"> <div> <div>PL</div> <div>EN</div> </div> </a>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
div.social {
  display: flex;
  align-items: center;
  a {
    font-size: 2rem;
    text-decoration: none;
    margin-right: 1.6rem;
    width: 3rem;
    img {
      width: 100%;
    }
    &:last-child {
      margin-right: 0;
      padding-bottom: 5px;
    }
    &:nth-child(3) {
      width: 2.8rem;
    }
  }
  a:last-child {
    width: 32px;
  }
  a:hover {
    img {
      opacity: .75;
    }
  }
  .lang {
    height: 30px;
    width: 27px;
    overflow: hidden;
    position: relative;
    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 6rem;
      position: absolute;
      bottom: 0;
      left: 0;
      transition: bottom .4s;
      font-size: 2rem;
    }
  }
  .lang:hover {
    > div {
      bottom: -26px;
    }
  }
}
</style>