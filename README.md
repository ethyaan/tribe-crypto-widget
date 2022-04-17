<div id="top"></div>

<br />
<div align="center">
  <a href="https://tribe.so">
    <img src="https://tribe.so/webflow-v2/images/TribeLogo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Tribe Crypto ShortCode Widget</h3>

  <p align="center">
    A set of shortcodes to add crypto currencies information into your post or comment
    <br />
    <a href="https://partners.tribe.so/docs/guide/index/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://partners.tribe.so/portal/">Build Apps</a>
    ·
    <a href="https://tribe-community.typeform.com/to/FpsR55AT"> Expert Network </a>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This Project adds this feature to tribe platform posts & replys to support defined crypto currency shortcodes which will be replaced with realtime market data.

example usage of the available shortcodes: <br />
```[cw top-10]```  will return the top 10 based on coinmarketcap ranking<br /> <br />
```[cw top-10 pair="TRY"]``` will return the top 10 based on coinmarketcap ranking with TRY instead of USD as second side of the pair<br /><br />
```[cw list="BNB,SOL,ADA"]``` will return the info about given list of currencies <br /> <br />
```[cw list="BTC,ETH,ADA" pair="EUR"]```  will return the info about given list of currencies with EUR instead of USD as second side of the pair <br />

Note: default value for `pair` is `USD`

 
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

Make sure you install the node and mongodb

### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Create your app at [partners.tribe.so](https://partners.tribe.so)
2. Clone the repo
   ```sh
   git clone https://github.com/tribeplatform/tribe-starter-app
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Create your .env file by duplicating .env.example
   ```js
   cp.env.example.env;
   ```
5. Add the credentials of your app, database, etc in the .env

<p align="right">(<a href="#top">back to top</a>)</p>

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[forks-url]: https://github.com/tribeplatform/tribe-starter-app/network/members
[stars-url]: https://github.com/tribeplatform/tribe-starter-app/stargazers
[issues-url]: https://github.com/tribeplatform/tribe-starter-app/issues
[product-screenshot]: images/screenshot.png
