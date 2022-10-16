const ethers = require("ethers");
const config = require("config");

const uniswapV2ContractAddress = config.get("uniswapV2ContractAddress");
const privateKey = process.env["MAINNET_PRIVATE_KEY"];

async function executeTrade(realRateData) {
  const { ethers } = require("ethers");

  async function main() {
    const contractAddress = uniswapV2ContractAddress;

    const baseTokenAddress = realRateData.token0Address;
    const token0 = realRateData.token0Address;
    const token1 = realRateData.token0Address;
    const dummyToken = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

    const factoryAddress = "0x6725F303b657a9451d8BA641348b6761A6CC7a17";
    const routerAddress = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";

    const borrowAmountHuman = "1";

    const {
      abi,
    } = require("../artifacts/contracts/TriangularFlashSwap.sol/TriangularFlashSwap.json");

    const {
      ERC20ABI,
    } = require("../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");

    let borrowAmount = ethers.utils.parseUnits(borrowAmountHuman, 6);

    let signer = new ethers.Wallet(privateKey, provider);

    const tradeContract = new ethers.Contract(contractAddress, abi, signer);
    let tx = await tradeContract.startArbitrage(
      baseTokenAddress,
      borrowAmount,
      token0,
      token1,
      factoryAddress,
      routerAddress,
      dummyToken,
      {
        gasLimit: 100000,
      }
    );

    console.log(tx);
  }
}
