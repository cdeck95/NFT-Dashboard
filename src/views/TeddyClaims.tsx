import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  ImageList,
  Menu,
  Popover,
  ThemeProvider,
  Typography,
  createTheme,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ConnectWallet,
  ThirdwebNftMedia,
  useContract,
  useNFT,
  useNetwork,
  useNetworkMismatch,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { useTitle } from "../hooks/useTitle";
import { useAddress } from "@thirdweb-dev/react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSDK } from "@thirdweb-dev/react";
import teddyABI from "../ABIs/teddyABI.json";
import tedABI from "../ABIs/tedABI.json";
import stakingABI from "../ABIs/stakingABI.json";
import honeyABI from "../ABIs/honeyABI.json";
import aiABI from "../ABIs/aiABI.json";
import { NFT, SmartContract } from "@thirdweb-dev/sdk";
import { BaseContract, BigNumber, ethers } from "ethers";
import { NumericFormat } from "react-number-format";
import NFTList from "../components/NFTList";
import "../styles/Dashboard.css";
import "../styles/HoneyExchange.css";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import {
  LoadETHAccountDetails,
  allOwnedNFTs,
} from "../account/loadETHAccountDetails";
import ConnectWalletPage from "../components/ConnectWalletPage";
import Sheet from "react-modal-sheet";
import { MainnetNetwork } from "../components/MainnetNetwork";
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { TokenProps } from "../components/AssetOverviewSidebar";
import ErrorDialog from "../components/ErrorDialog";
import { PolygonProps } from "./Dashboard";
import TedClaims from "./TedClaims";
import ComingSoon from "./ComingSoon";
import { TED_POLYGON_CONTRACT, TEDDIES_POLYGON_CONTRACT, AITEDS_POLYGON_CONTRACT } from "../account/loadPolygonAccountDetails";
import IconMenu from "../components/IconMenu";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SuccessDialog from "../components/SuccessDialog";
import LoadingDialog from "../components/LoadingDialog";
import RenameDialog from "../components/RenameDialog";
import PullToRefresh from "react-simple-pull-to-refresh";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import tedMintLogo from "../assets/tedMint.png";
import teddyMintLogo from "../assets/teddyMint.gif";
import aiTedMintLogo from "../assets/aiTedMint.png";
import ClaimMenu from "../components/ClaimMenu";
import SouthIcon from '@mui/icons-material/South';

const IS_DISABLED = true;

function TeddyClaims(props: PolygonProps) {
  useTitle("FOTF | Teddy Claims");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));
  const isMediumLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const isLarge = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isXL = useMediaQuery(theme.breakpoints.up("xl"));
  const isFullScreen = useMediaQuery(theme.breakpoints.up(1800));
  const [isSmallScreen, setSmallScreen] = useState(false);
  const sdk = useSDK();
  const provider = sdk?.getProvider();
  const address = useAddress(); // Get connected wallet address
  // const [, switchNetwork] = useNetwork(); // Switch to desired chain
  // const isMismatched = useNetworkMismatch(); // Detect if user is connected to the wrong network
  // const [showMismatch, setShowMismatch] = useState(false);

  const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--primary-color");
  const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue("--secondary-color");
  const sidebarBackgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--sidebar-background-color");
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue("--accent-color");
  const errorColor = getComputedStyle(document.documentElement).getPropertyValue("--error-color");

  const [isSheetOpen, setSheetOpen] = useState(false);
  console.log(`Mobile:  ${isMobile}`);
  console.log(`Small:  ${isSmall}`);
  console.log(`Medium:  ${isMedium}`);
  console.log(`Medium-Large:  ${isMediumLarge}`);
  console.log(`Large:  ${isLarge}`);
  console.log(`XL:  ${isXL}`);
  console.log(`Is 1920:  ${isFullScreen}`);

  const { leftNavOpen, rightNavOpen } = props;
  const { tokens, isLoadingTeddy, errorTeddy, maticBalance, needsFunds, honeyBalance, honeyContract, honeyExchangeContract, isLoadingHoney, isLoadingHoneyContract, isLoadingHoneyExchangeContract } = props.tokenProps;
  const showMismatch = props.showMismatch;
  console.log(tokens);
  console.log(isLoadingTeddy);
  console.log(errorTeddy);
  console.log(maticBalance);
  console.log(needsFunds);
  console.log(honeyBalance);
  console.log(honeyContract);
  console.log(honeyExchangeContract);
  console.log(isLoadingHoney);
  console.log(isLoadingHoneyContract);
  console.log(isLoadingHoneyExchangeContract);

  const isLoading = isLoadingTeddy;

  const [isLoadingAWS, setIsLoadingAWS] = useState(false);
  const [successAWS, setSuccessAWS] = useState(false);

  const teddyNFTs = tokens.Teddies?.tokens;

  const leftDrawerWidth = isSmallScreen ? "0px" : "260px";
  const rightDrawerWidth = isSmallScreen ? "0px" : "340px";

  const [selectedTokens, setSelectedTokens] = useState<any>([]);
  const [selectedTokensIDs, setSelectedTokensIDs] = useState<number[]>([]);
  const [selectedTokenContracts, setSelectedTokenContracts] = useState<string[]>([]);
  const [honeyRewards, setHoneyRewards] = useState<string>("0");

  console.log(selectedTokens);
  console.log(selectedTokensIDs);
  console.log(selectedTokenContracts);
  
  const [claimableHoneyBalance, setClaimableHoneyBalance] = useState<BigNumber>(BigNumber.from(0));

  const [columns, setColumns] = useState(3);

  useEffect(() => {
    if (isMobile) {
      if (isSmall) {
        setColumns(1);
      } else {
        setColumns(2);
      }
    } else {
      if (isSmall) {
        setColumns(1);
      } else if (isMedium) {
        setColumns(1);
      } else if (isMediumLarge) {
        setColumns(2);
      } else if (isLarge) {
        setColumns(2);
      } else if (isXL && !isFullScreen) {
        setColumns(3);
      } else if (isFullScreen) {
        setColumns(4);
      } else {
        setColumns(3);
      }
    }
  }, [isMobile, isSmall, isMedium, isMediumLarge, isLarge, isXL, isFullScreen]);

  const add = (token: NFT) => {
    console.log("adding...");
    handleCloseContextMenu();
    handleOnSelect(token);
  };

  function handleOnSelect(token: NFT) {
    if (selectedTokens?.includes(token)) {
      const index = selectedTokens?.indexOf(token);
      if (index !== undefined) {
        const splicedArray = [...selectedTokens];
        splicedArray.splice(index, 1);
        console.log(splicedArray);
        setSelectedTokens(splicedArray);

        const splicedArrayIDs = [...selectedTokensIDs];
        splicedArrayIDs.splice(index, 1);
        console.log(splicedArrayIDs);
        setSelectedTokensIDs(splicedArrayIDs);

        const splicedArrayOfContracts = [...selectedTokenContracts];
        splicedArrayOfContracts.splice(index, 1);
        console.log(splicedArrayOfContracts);
        setSelectedTokenContracts(splicedArrayOfContracts);
      }
      // setSelectedTokens(selectedTokens);
      console.log("removed token, tokenID & contract");
      return;
    } else {
      if(teddyNFTs?.includes(token)){
        setSelectedTokenContracts([...selectedTokenContracts, TEDDIES_POLYGON_CONTRACT]);
      } else {
        console.log("Selected token not found in owned arrays, aborting")
        setShowError(true);
        setErrorCode(9);
        return;
      }
      setSelectedTokensIDs([...selectedTokensIDs, parseInt(token.metadata.id!)])
      setSelectedTokens([...selectedTokens, token]);
      console.log("pushed token, token ID & contract");
    }
  }

  const [open, setOpen] = useState(false);
  
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (isMediumLarge || isMobile) {
      setSmallScreen(true);
      setSheetOpen(true);
    } else {
      setSmallScreen(false);
      setSheetOpen(false);
    }

    // if (isMismatched && (!isSmallScreen || (isSmallScreen && !rightNavOpen && !leftNavOpen))){
    //   setShowMismatch(true);
    // } else {
    //   setShowMismatch(false);
    // }
  }, [isMediumLarge, isMobile, isSmallScreen, leftNavOpen, rightNavOpen]);

  //////////// Header ///////////////////////////

  interface IDictionary {
    [index: string]: string;
  }

  const [searchInput, setSearchInput] = useState("");
  const [filteredNFTsWithCategory, setFilteredNFTsWithCategory] = useState<NFT[]>([]);

  const handleSearch = (e: {
    preventDefault: () => void;
    target: { value: SetStateAction<string> };
  }) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const handleRefresh = async () => {
    window.location.reload();
  }  

  const [filteredNFTs, setFilteredNFTs] = useState<NFT[]>([]);
  
  console.log(filteredNFTs);

  const [ownershipVerified, setOwnershipVerified] = useState(true);

  useEffect(() => {
    if(teddyNFTs !== undefined){
      if (teddyNFTs.length === 0) {
        setOwnershipVerified(false);
      } else {
        setOwnershipVerified(true);
        setFilteredNFTs(teddyNFTs!.filter((e) => e.metadata.id!.includes(searchInput)));
      }
    } else {
      setOwnershipVerified(false);
    }
  }, [searchInput, teddyNFTs]);

  const [showError, setShowError] = useState(false);
  const [errorCode, setErrorCode] = useState(0);

  const handleErrorClose = () => {
    setShowError(false);
  };


  function claimHNY(selectedTokens: NFT[]) {
    console.log("claim hny clicked");
    if(IS_DISABLED) {
      setShowError(true);
      setErrorCode(4);
      return;
    }  
  }

  function claimAllHNY() {
    console.log("claim all HNY clicked");
    if(IS_DISABLED) {
      setShowError(true);
      setErrorCode(4);
      return;
    }
  }

  const [tokenClicked, setTokenClicked] = useState<NFT>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openContextMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseContextMenu = () => {
    setAnchorEl(null);
  };

  const TeddiesDailyEarnings = 35;
  const [totalTeddiesEarnings, setTotalTeddiesEarnings] = useState(0);

  useEffect(() => {
    if (tokens === undefined) {
      return;
    }
    if (tokens!.Teddies === undefined) {
      console.log("no teddies");
      return;
    } 
    if (tokens!.Teddies?.tokens === undefined) {
      console.log("no teddies");
      return;
    }
    
    setTotalTeddiesEarnings(tokens!.Teddies?.tokens.length * TeddiesDailyEarnings);

  }, [tokens,tokens.Teddies, tokens.Teddies?.tokens]);

  const themeMenu = createTheme({
    typography: {
      fontFamily: ["Bebas Neue", "Roboto", "Helvetica", "Arial"].join(","),
      fontSize: 16,
      fontWeightLight: 300,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: "none",
            padding: "0px",
            margin: "0px"
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            padding: "0px",
            margin: "0px",
          },
        },
      }
    },
  });

    const [claimInput, setClaimInput] = useState<string>("");
    const [honeyForClaimInput, setHoneyForClaimInput] = useState<string>("XXXX");

    const handleInput = (e: {
      preventDefault: () => void;
      target: { value: SetStateAction<string> };
    }) => {
      e.preventDefault();
      if(e.target.value === "") {
        setClaimInput("XXXX");
        setHoneyForClaimInput("XXXX");
        return;
      }
      else {
        setClaimInput((e.target.value).toString());
        //TODO: calculate honey for claim via contract
        setHoneyForClaimInput((e.target.value).toString());
      }
    };  

    const claimHoney = async (tokenID: string) => {
      console.log("claim honey clicked");
      console.log(`Token ID for Claim: ${tokenID}`);
    }

  //////////////////////////////////////////////

  return <ComingSoon />;
//   return (
//     <Box
//       className={
//         isSmallScreen
//           ? "factory-inner-container-mobile"
//           : "factory-inner-container"
//       } sx={{zIndex: "1 !important", position: "relative", overflowY: "auto !important"}}
//     >

// {isLoading && !showMismatch && <Backdrop
//         sx={{
//           color: "#fff",
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           marginLeft: leftDrawerWidth,
//           marginRight: rightDrawerWidth,
//         }}
//         open={isLoading && !showMismatch}
//       >
//         <CircularProgress color="inherit" />
//       </Backdrop>
// }

// {!ownershipVerified && !isLoading && !showMismatch && <Backdrop
//         sx={{
//           color: "#fff",
//           zIndex: (theme) => theme.zIndex.drawer + 1,
//           marginLeft: leftDrawerWidth,
//           marginRight: rightDrawerWidth,
//         }}
//         open={!isLoading}
//         onClick={handleClose}
//       >
//         <Box sx={{ borderRadius: "10px", backgroundColor: "white" }}>
//           <Typography sx={{ padding: "20px", color: "Black" }}>
//             You do not own any Teddies by FOTF. 
//           </Typography>
//           <Typography sx={{ padding: "20px", color: "Black" }}>
//             Please visit the Dashboard to view your owned NFTs.
//           </Typography>
//         </Box>
//       </Backdrop>
// }

//       <ErrorDialog
//         open={showError}
//         handleClose={handleErrorClose}
//         errorCode={errorCode}
//         collection={"Honey Exchange"}
//       />

//       <Box className={isSmallScreen ? "header-mobile" : "header"} sx={{marginBottom: "20px"}}>
//         <Box className={isSmallScreen ? "header-row-mobile" : "header-row"}>
//           {!isSmallScreen && <Typography className={isSmallScreen ? "page-header-mobile" : "page-header"} sx={{fontWeight: "500"}} >
//             Teddy $HNY Claims
//           </Typography> }
//         </Box>
//       </Box>

//       <Box className={isSmallScreen? "column-center-full-container" : "row-space-around-dash"} sx={{ maxHeight: "300px"}}>
//           <Box className={isSmallScreen? "column-center-full-container" : "row-space-around-dash"} sx={{ maxHeight: "300px"}}>
//             <Box className="column-between" sx={{ maxHeight: "350px", padding: "0px !important"}}>
//               <Box className="row-space-around">
//                 <Box className="column-around" sx={{padding: "10px"}}>
//                   <Typography className="learnMore">Claimable $HNY Balance</Typography>
//                   {isLoadingHoneyExchangeContract //TODO, change this to the actual contract
//                   ? <CircularProgress size="1rem" color="inherit" />
//                   : <Typography sx={{fontSize: "2.5rem", margin: 0, padding: 0,
//                   marginBlockStart: "0em", marginBlockEnd: "0em"}}>{new Intl.NumberFormat("en-US", { minimumIntegerDigits: 2}).format(parseInt(claimableHoneyBalance.toString()))} $HNY</Typography>
//                 }
                  
//                 </Box>
//               </Box>
//               <Box className="row-space-around">
//                 <Box className="column-even" sx={{padding: "10px"}}>
//                   <Typography className="learnMore">Currently Earning</Typography>
//                   {isLoadingHoneyExchangeContract
//                   ? <CircularProgress size="1rem" color="inherit" />
//                   : <Typography sx={{fontSize: "2.5rem", margin: 0, padding: 0,
//                   marginBlockStart: "0em", marginBlockEnd: "0em"}}>{totalTeddiesEarnings.toLocaleString()}/Day</Typography>
//                   }
//                 </Box>
//               </Box>
//             </Box>
//             <Box className={isSmallScreen? "honey-exchange-col-full" : "teddy-claim-col"}>
//               <Box className="row-exchange" sx={{ justifyContent: "flex-start", paddingLeft: "20px", paddingRight: "20px"}}>
//                 <Typography sx={{fontSize: "1.5rem"}}>Quick Claim</Typography>
//               </Box>
//               <Box className="row-exchange" sx={{justifyContent: "flex-start", paddingLeft: "20px", paddingRight: "20px"}}>
//                 <Paper
//                   component="form"
//                   sx={{ p: '2px 4px', display: 'flex', alignItems: 'flex-start', width: "100%" }}
//                 >
//                   <InputBase
//                     sx={{ ml: 1, flex: 1 }}
//                     //TODO: change this to the actual contract
//                     disabled={isLoadingHoneyExchangeContract}
//                     type="number"
//                     placeholder="Enter Teddy ID #"
//                     inputProps={{ 'aria-label': 'Enter the Teddy ID to Claim its $HNY' }}
//                     onChange={handleInput}
//                     value={claimInput.toString()}
//                   />
                  
//                 </Paper>
//                 <Button> Calculate </Button>
//               </Box>
//               <Box className="row-exchange" sx={{justifyContent: "flex-start", paddingLeft: "20px", paddingRight: "20px"}}>
//                 <Button variant="contained" disabled={isLoadingHoneyExchangeContract} color="primary" className="exchange-button" 
//                 sx={{ fontSize: "1.5rem", width: "100%" }} onClick={() => claimHoney(claimInput.toString())} >
//                   Claim {parseInt(honeyForClaimInput.toString()).toLocaleString("en-US")} $HNY
//                 </Button>
//               </Box>
//             </Box>
//           </Box>
//         </Box>

//         <Box className="row-space-around" sx={{ justifyContent: "space-between !important", width: "100%", maxWidth: "1380px", height: "60px", margin: "auto", padding: "10px", marginTop: "00px", marginBottom: "20px" }}>
//           <Typography>Check if Teddy has been claimed</Typography>
//           <SouthIcon color="inherit"/>
//         </Box>

//         <Box className={isSmallScreen ? "header-mobile" : "header"} sx={{marginBottom: "10px"}}>
//           <Box className={isSmallScreen ? "header-row-mobile" : "header-row"}>
//             {!isSmallScreen && <Typography className={isSmallScreen ? "page-header-mobile" : "page-header"} sx={{fontSize: "1.5rem !important"}}>
//               Teddy Claims
//             </Typography> }
//             <Paper
//               component="form"
//               sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
//             >
              
//               <InputBase
//                 sx={{ ml: 1, flex: 1 }}
//                 placeholder="Search for Teddy Token ID"
//                 inputProps={{ 'aria-label': 'Search for Ted, Teddy or AI Token ID' }}
//                 onChange={handleSearch}
//                 value={searchInput}
//               />
//               <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
//                 <SearchIcon />
//               </IconButton>
//             </Paper>
             
//           </Box>
         
          
//         </Box>
//       <Box>
//         {errorTeddy ? (
//           <div>
//             <p>NFT not found - error</p>
//           </div>
//         ) : (
//           <Box
//             className="gallery"
//             sx={{
//               // zIndex: "0 !important",
//               paddingLeft: "10px",
//               paddingBottom: "110px",
//               backgroundColor: "white",
//               paddingRight: "10px",
//               overflowX: "hidden",
//               overflowY: "auto"
//             }}
//           >
//             {tokens ? (
//               <ImageList
//                 sx={{
//                   justifyContent: "center",
//                   width: "100%",
//                   height: "100%",
//                   paddingLeft: "10px",
//                   paddingRight: "10px",
//                   overflowX: "hidden",
//                   overflowY: "auto",
//                   backgroundColor: "white",
//                 }}
//                 className="factory-image-list"
//                 cols={columns}
//                 gap={25}
//                 rowHeight={450}
//               >
                
//                 {/* {filteredNFTsWithCategory.map((token: NFT) => ( */}
//                   {filteredNFTs.map((token: NFT) => (
//                   <Box
//                     key={token.metadata.name}
//                     className={
//                       selectedTokens?.includes(token)
//                         ? "card-selected"
//                         : "card"
//                     }
//                     sx={{
//                       marginLeft: "auto",
//                       marginRight: "auto",
//                       background: "none",
//                       maxHeight: "375px",
//                       maxWidth: "350px",
//                     }}
//                   >
//                     {/* <StarBorderIcon
//                     onClick={star}
//                     sx={{ position: "absolute", top: "10px", right: "10px" }}
//                   /> */}
//                     <Box
//                       sx={{
//                         position: "relative",
//                         cursor: "pointer",
//                       }}
//                       onClick={() => add(token)}
//                     >
//                       <ThirdwebNftMedia
//                         metadata={token.metadata}
//                         style={{
//                           maxHeight: "280px",
//                           maxWidth: "280px",
//                           borderRadius: "10px",
//                           objectFit: "cover",
//                           width: "280px",
//                           height: "280px",
//                         }}
//                       />

//                       {selectedTokens?.includes(token) && (
//                         <p className="title-selected">Claim</p>
//                       )}
//                     </Box>
//                     <Box
//                       className="column-container"
//                       sx={{ marginBottom: "10px" }}
//                     >
//                       <div className="large-left-column">
//                         <h3 className="metadata-title">
//                           {token.metadata.name}
//                         </h3>
//                         {teddyNFTs?.includes(token) && (
//                           <Chip label="Teddies by FOTF" color="secondary" sx={{maxWidth: "125px"}} variant="outlined"/>
//                         )}
//                       </div>
//                       <div className="small-right-column" onClick={() => {
//                         if(anchorEl === null){
//                           setTokenClicked(token)
//                         }
//                       }}>
//                         {/* <ControlPointIcon
//                           onClick={() => add(token)}
//                           fontSize="small"
//                         /> */}
//                         <Button
//                             id="basic-button"
//                             aria-controls={openContextMenu ? 'basic-menu' : undefined}
//                             aria-haspopup="true"
//                             aria-expanded={openContextMenu ? 'true' : undefined}
//                             onClick={handleClick}
//                             sx={{background: "none", color: "black", border: "none", minWidth: "0px", padding: "0px", "&:hover": {background: "none", color: "black", minWidth: "0px", padding: "0px"}}}
//                           >
//                             <MoreVertIcon/>
//                           </Button>
//                           <ThemeProvider theme={themeMenu} >
//                           <Menu
//                             id="basic-menu"
//                             anchorEl={anchorEl}
//                             open={openContextMenu}
//                             onClose={handleCloseContextMenu}
//                             sx={{ zIndex: "10001"}}
//                             MenuListProps={{
//                               'aria-labelledby': 'basic-button',
//                             }}
//                           >
//                             <ClaimMenu token={tokenClicked!} onClose={handleCloseContextMenu} addToClaimList={() => add(tokenClicked!)} selectedTokens={selectedTokens}/>
//                           </Menu>
//                           </ThemeProvider>
//                       </div>
//                     </Box>
//                   </Box>
//                 ))}
//               </ImageList>
//             ) : (
//               <p>Loading...</p>
//             )}
            
//           </Box>
//         )}
      
//       {address && !isSmallScreen && !isLarge && (
//       <Box
//         sx={{
//           position: "fixed",
//           paddingLeft: "20px",
//           bottom: "0px",
//           left: leftDrawerWidth,
//           right: rightDrawerWidth,
//           height: "70px",
//           zIndex: (theme: { zIndex: { drawer: number } }) =>
//             theme.zIndex.drawer - 1,
//           backgroundColor: accentColor,
//         }}
//       >
//         <Box className="row-space-between">
//           <Box
//             className="selected-box"
//             sx={{ display: "flex", flexDirection: "row" }}
//           >
//             {teddyNFTs && <Box className="stats-col">
//               <p className="stats">
//                 {new Intl.NumberFormat("en-US", {
//                   minimumIntegerDigits: 2,
//                 }).format(teddyNFTs!.length)}
//               </p>
//               <p className="stats-name">Staked Teddies</p>
//             </Box>}
//           </Box>
//           {/* <NumericFormat value={honeyBalance} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={' HNY'} /> */}
//           <Box
//             className="burn-box"
//             sx={{ display: "flex", flexDirection: "row" }}
//           >
//             {/* <Button className="burn-btn" disabled={selectedTokens.length === 0} onClick={() => claimHNY(selectedTokens)}>
//               Claim {parseInt(honeyRewards).toLocaleString()} $HNY via {selectedTokens.length} Teddies
//             </Button> */}
//             <Button className="burn-btn" disabled={selectedTokens.length === 0} onClick={() => claimHNY(selectedTokens)}>
//               Claim TBD $HNY via {selectedTokens.length} Teddies
//             </Button>
//             <Button className="burn-btn" onClick={() => claimAllHNY()}>
//               Claim all $HNY
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//         )}
//         {(isSmallScreen || isLarge) && (
//       <Box
//         sx={{
//           position: "fixed",
//           paddingLeft: "20px",
//           paddingRight: "20px",
//           marginLeft: leftDrawerWidth,
//           marginRight: rightDrawerWidth,
//           bottom: "0px",
//           left: "0px",
//           height: "70px",
//           width: "100dvw",
//           backgroundColor: accentColor,
//           // zIndex: "1",
//           display: "flex",
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//           cursor: "pointer",
//           border: "2px solid black",
//         }}
//         onClick={() => setSheetOpen(true)}
//       >
//         <Typography className="factory-sheet-text">
//           {selectedTokens.length === 1
//             ? `Ready to Claim ${selectedTokens.length} token?`
//             : `Ready to Claim ${selectedTokens.length} tokens?`
//           }
//         </Typography>
//         <ExpandMoreOutlinedIcon/>
//       </Box>
//     )}
//       </Box>

//       <SuccessDialog
//         open={successAWS}
//         setOpen={setSuccessAWS}
//         successCode={4}
//       />

//       <LoadingDialog
//         open={isLoadingAWS}
//         loadingCode={3}
//         onClose={() => setIsLoadingAWS(false)}
//       />

//       <ErrorDialog
//         open={showError}
//         handleClose={handleErrorClose}
//         errorCode={errorCode}
//         collection={"Teddy Claims"}
//       />

//       <Sheet
//         rootId="root"
//         isOpen={isSheetOpen && !showMismatch && ownershipVerified && (!isSmallScreen || (isSmallScreen && !rightNavOpen && !leftNavOpen) )}
//         onClose={() => setSheetOpen(false)}
//         detent="content-height"
//       >
//         <Sheet.Container>
//           <Sheet.Header/>
//           <Sheet.Content>
//             <Box
//               className="selected-box-mobile"
//               sx={{ display: "flex", flexDirection: "row" }}>
//               {teddyNFTs && <Box className="stats-col">
//                 <p className="stats">
//                   {new Intl.NumberFormat("en-US", {
//                     minimumIntegerDigits: 2,
//                   }).format(teddyNFTs!.length)}
//                 </p>
//                 <p className="stats-name">Staked Teddies</p>
//               </Box>}
//             </Box>
//             {/* <NumericFormat value={honeyBalance} displayType={'text'} thousandSeparator={true} prefix={'$'} suffix={' HNY'} /> */}
//             <Box className="burn-box-mobile">
//               <Button
//                 className="burn-btn-mobile "
//                 disabled={selectedTokens.length === 0}
//                 onClick={() => claimHNY(selectedTokens)}
//               >
//                 Claim TBD $HNY via {selectedTokens.length} Teddies
//               </Button>
//               {/* <Button
//                 className="burn-btn-mobile "
//                 disabled={selectedTokens.length === 0}
//                 onClick={() => claimHNY(selectedTokens)}
//               >
//                 Claim {parseInt(honeyRewards).toLocaleString()} $HNY via {selectedTokens.length} Teddies
//               </Button> */}
//               <Button className="burn-btn-mobile " onClick={() => claimAllHNY()}>
//                 Claim all $HNY
//               </Button>
//             </Box>
//           </Sheet.Content>
//         </Sheet.Container>

//         <Sheet.Backdrop />
//       </Sheet>
//     </Box>
//   );
}

export default TeddyClaims;
