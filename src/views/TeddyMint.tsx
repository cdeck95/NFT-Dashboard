import { Backdrop, Box, Button, ButtonGroup, CircularProgress, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTitle } from "../hooks/useTitle";
import "../styles/Dashboard.css";
import { ThirdwebNftMedia, useAddress, useClaimedNFTSupply, useContract, useContractMetadata, useUnclaimedNFTSupply } from "@thirdweb-dev/react";
import { useSDK } from "@thirdweb-dev/react";
import ComingSoon from "./ComingSoon";
import { AITEDS_POLYGON_CONTRACT, TEDDIES_POLYGON_CONTRACT } from "../account/loadPolygonAccountDetails";
import { useEffect, useState } from "react";
import BridgeSuccessDialog from "../components/BridgeSuccessDialog";
import ErrorDialog from "../components/ErrorDialog";
import LoadingDialog from "../components/LoadingDialog";
import MaticDialog from "../components/MaticDialog";
import { PolygonNetwork } from "../components/PolygonNetwork";
import teddyPlaceholderImage from "../assets/teddyLogoForPlaceholders.png"
import "../styles/mint.css";
import SuccessDialog from "../components/SuccessDialog";
import { BigNumber } from "ethers";
import teddyMintLogo from "../assets/teddyMint.gif"
import { MintProps } from "./TedMint";
import RevealDialog from "../components/RevealDialog";

const COLLECTION_FOR_MINT = "Teddies by FOTF";
const DESCRIPTION_FOR_MINT = () => {
  return <Typography className="desc-text">The charity initiative of Fury of the Fur Teddies have moved to Polygon with the rest and are ready to take over again.
  <br></br>50% of all mint proceeds will be donated to charity. Start aging your Teddy today by minting.</Typography>
} 

function TeddyMint(props: MintProps) {
    useTitle("Mint Teddies - 10 MATIC");
    const theme = useTheme();
    const isMobile = !useMediaQuery(theme.breakpoints.up("md"));
    const isMediumLarge = useMediaQuery(theme.breakpoints.down("lg"));
    const [isSmallScreen, setSmallScreen] = useState(false);
    const leftDrawerWidth = isSmallScreen ? "0px" : "260px";
    const rightDrawerWidth = isSmallScreen ? "0px" : "340px";
    const sdk = useSDK();
    const provider = sdk?.getProvider();
    const address = useAddress();
    const showMismatch = props.showMismatch;

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary-color");
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color");
    const sidebarBackgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-background-color");
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--accent-color");
    const errorColor = getComputedStyle(document.documentElement).getPropertyValue("--error-color");

    const contract = props.contract;
    const isLoadingContract = props.isloadingContract;

    // const {contract:  teddiesPolygonContract, isLoading: isLoadingContract, error } = useContract(TEDDIES_POLYGON_CONTRACT);
    // console.log(teddiesPolygonContract);

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isReveal, setIsReveal] = useState(false);
    const [failure, setFailure] = useState(false);
    const [needsFunds, setNeedsFunds] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorCode, setErrorCode] = useState(0);
    const [counter, setCounter] = useState(0);
    const [open, setOpen] = useState(false);
    const [mintedTokens, setMintedTokens] = useState<string[]>([]);

    

    useEffect(() => {
        if (isMediumLarge || isMobile) {
        setSmallScreen(true);
        } else {
        setSmallScreen(false);
        }
    }, [isMediumLarge, isMobile, isSmallScreen]);


//   these dont work yet
//   const { data: contractMetadata } = useContractMetadata(aiTedsPolygonContract);
//   const unclaimedSupply = useUnclaimedNFTSupply(aiTedsPolygonContract);
//   const claimedSupply = useClaimedNFTSupply(aiTedsPolygonContract);
  
//////////////////// Function Calls Start ////////////////////
    const handleMaticClose = () => {
        setNeedsFunds!(false);
        console.log("closing dialog");
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    function handleErrorClose(): void {
        setShowError(false);
    }

    const handleLoadingClosed = () => {
        setIsLoading(false);
    };

    const handleIncrement = () => {
        setCounter(counter + 1);
    };

    const handleDecrement = () => {
        if(counter > 0) {
            setCounter(counter - 1);
        }
    };  

    const mint = async () => {
        try {
          setIsLoading(true);
          const payableAmountPer = BigNumber.from(10).mul(BigNumber.from(10).pow(18));
          const payableAmount = BigNumber.from(counter).mul(payableAmountPer);
          const tx = await contract?.call(
          "mint", [BigNumber.from(counter)],
          {
            value: payableAmount
          });
          console.log(tx);
          const events = tx["receipt"]["events"];
          const mintedIDs:string[] = [];
          for (let i = 1; i < events.length-1; i++) {
            const jsonForID = events[i]["args"][2];
            console.log(jsonForID);
            const hexID = jsonForID["_hex"];
            console.log(hexID);
            const id = BigNumber.from(hexID).toString();
            console.log(id);
            mintedIDs.push(id);
          }
          setMintedTokens(mintedIDs);
          setIsLoading(false);
          setIsReveal(true);
          return tx;
        } catch (e: any) {
            console.log(e);
            console.log(e.message);
            setIsLoading(false);
            setIsReveal(false);
            if (e.message.includes("Reason: user rejected transaction")){
              return "User denied transaction signature.";
            } else if (e.message.includes("Reason: Address is not whitelisted")){
              return `You are not whitelisted to Mint ${COLLECTION_FOR_MINT}`;
            } else {
              alert("Something went wrong, please try again");
              return e.message;
            } 
        }};

//////////////////// Function Calls End ////////////////////


return (
  <Box
    className={isSmallScreen
        ? "inner-container-mint-mobile"
        : "inner-container-mint"
    }
  >
    {isLoadingContract && !showMismatch && <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          marginLeft: leftDrawerWidth,
          marginRight: rightDrawerWidth,
        }}
        open={isLoadingContract}
      >
        <CircularProgress color="inherit" />
      </Backdrop>}
    <MaticDialog
      open={needsFunds}
      handleClose={handleMaticClose}
    />
    {!isSmallScreen && <Box className="row-center">
      <h1 className="Large-Header">Mint <span className="accent-text">{COLLECTION_FOR_MINT}</span></h1>
    </Box>}
    <Box
      className="row-center"
      sx={{ paddingTop: "10px", paddingBottom: "10px" }}
    >
      {DESCRIPTION_FOR_MINT()}
    </Box>
    <Box
      className="row-around"
      sx={{
        height: "auto",
        paddingTop: "10px",
        paddingBottom: "10px",
      }}
    >
        <Box className={isSmallScreen ? "column" : "row-even"}>
          <img src={teddyMintLogo} alt="Teddy Placeholder" className={isSmallScreen ? "mint-image-mobile" : "mint-image"} />
          <Box className={isSmallScreen ? "col-mint-mobile" : "col-mint"}>
              <ButtonGroup size="large" aria-label="small outlined button group">
                  <Button disabled={!(counter > 0)} onClick={() => handleDecrement()}>-</Button>
                  <Button disabled>{counter}</Button>
                  <Button onClick={() => handleIncrement()}>+</Button>
              </ButtonGroup>
              <Button className="mint-button" disabled={counter===0} onClick={() => mint()}>
                  Mint {counter} {COLLECTION_FOR_MINT}
              </Button>
          </Box>
        </Box>
    </Box>
    <Box
      className={isSmallScreen ? "column" : "row-center"}
      sx={{ paddingTop: "10px", paddingBottom: "10px" }}
    >
      <Typography className="desc-text">
        <span className="accent-text">Note:</span> If you find any issues
        please open a support ticket in the{" "}
        <a href="https://discord.gg/fotf">
          <span className="underline">FOTF Discord.</span>
        </a>
      </Typography>
    </Box>
    

    <SuccessDialog
      open={success}
      setOpen={setSuccess}
      collection={COLLECTION_FOR_MINT}
      count={counter}
      successCode={2}
    />

    
    <RevealDialog
        open={isReveal}
        setOpen={setIsReveal}
        mintedIds={mintedTokens}
        contract={contract!}
        collection={"Teddies by FOTF"}
      />

    <LoadingDialog
      open={isLoading}
      onClose={handleLoadingClosed}
      collection={COLLECTION_FOR_MINT}
      collectionCount={counter}
      loadingCode={2}
    />

    <ErrorDialog
      open={showError}
      handleClose={handleErrorClose}
      errorCode={errorCode}
      collection={COLLECTION_FOR_MINT}
    />
  </Box>
);

}

export default TeddyMint;
