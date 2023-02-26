import {
  AddresslistVotingClient,
  ApproveProposalStep,
  Client,
  Context,
  ContextPlugin,
  CreateDaoParams,
  CreateMajorityVotingProposalParams,
  DaoCreationSteps,
  DaoDepositSteps,
  DaoMetadata,
  IAddresslistVotingPluginInstall,
  ITokenVotingPluginInstall,
  MultisigClient,
  MultisigPluginInstallParams,
  ProposalCreationSteps,
  ProposalMetadata,
  TokenType,
  TokenVotingClient,
  VoteProposalStep,
  VoteValues,
  VotingMode,
} from "@aragon/sdk-client";
import { defaultAbiCoder } from "@ethersproject/abi";
import { id } from "@ethersproject/hash";
import * as aragonContracts from "@aragon/core-contracts-ethers";
import { Wallet } from "ethers";
import { parseEther, toUtf8Bytes } from "ethers/lib/utils";
import { hexToBytes } from "@aragon/sdk-common";


// Your private key goe es here
const TEST_WALLET =
  "";

const ctx: Context = new Context({
  network: "goerli",
  signer: new Wallet(TEST_WALLET),
  daoFactoryAddress: "0x001407A020bE25589f70F1D4D668BFeA1C69eb9C",
  web3Providers: [
    "https://rpc.ankr.com/eth_goerli",
  ],
  ipfsNodes: [
    {
      url: "https://testing-ipfs-0.aragon.network/api/v0",
      headers: {
        "X-API-KEY": import.meta.env.VITE_IPFS_API_KEY,
      },
    },
  ],
  graphqlNodes: [
    {
      url:
        "https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/core-goerli/api",
    },
  ],
});

const client = new Client(ctx);
const ctxPlugin = ContextPlugin.fromContext(ctx);
const tokenVotingClient = new TokenVotingClient(ctxPlugin);
const multisigClient = new MultisigClient(ctxPlugin);
const addresslistVotingClient = new AddresslistVotingClient(ctxPlugin);

let tokenVotingPluginAddress = "0x8a5188778239bC28ADFabcc16187bDd48A60B191";
let multisigPluginAddress = "0xBaD39BdA1F40B613Ae9Ec5fC2dcCcf08C17CdEE1";
let addresslistPluginAddress = "0xeB56564b617B093B60b2d5734481Cf400780e37b";
let adminPluginAddress = "0x63809A53D73414922375de414aFeBB8656a4bFda";
export const createTokenVotingDao = async () => {
  const rand = Math.ceil(Math.random() * 10000);
  const tokenVotingPluginParams: ITokenVotingPluginInstall = {
    votingSettings: {
      minDuration: 3600,
      minParticipation: 0.5,
      supportThreshold: 0.5,
      minProposerVotingPower: BigInt(1),
      votingMode: VotingMode.STANDARD,
    },
    newToken: {
      name: "Test Token #" + rand,

      symbol: "TTJ",
      decimals: 18,
      balances: [{
        address: "0xc8541aAE19C5069482239735AD64FAC3dCc52Ca2",
        balance: parseEther("50").toBigInt(),
      }],
    },
  };
  const tokenVotingPlugin = TokenVotingClient.encoding.getPluginInstallItem(
    tokenVotingPluginParams,
  );
  tokenVotingPlugin.id = "0xb60Fd6C478541eE150DE7aE7bd379612b2626234";
  const metadata: DaoMetadata = {
    name: "Token Voting DAO #" + rand,
    description: "This is the description of a token voting dao",
    links: [],
  };
  const metadataUri = await client.methods.pinMetadata(metadata);
  const params: CreateDaoParams = {
    metadataUri,
    ensSubdomain: "token-voting-dao-" + rand,
    plugins: [
      tokenVotingPlugin,
    ],
  };
  const steps = client.methods.createDao(params);
  for await (const step of steps) {
    switch (step.key) {
      case DaoCreationSteps.CREATING:
        console.log("creating...:" + step.txHash);
        break;
      case DaoCreationSteps.DONE:
        console.log("TokenVotingDao:" + step.address);
        console.log("TokenVotingDao plugins:" + step.pluginAddresses);
        tokenVotingPluginAddress = step.pluginAddresses[0];
      default:
        break;
    }
  }
};
export const createMultisigDao = async () => {
  const rand = Math.ceil(Math.random() * 10000);
  const multisigPluginParams: MultisigPluginInstallParams = {
    members: [
      "0xc8541aAE19C5069482239735AD64FAC3dCc52Ca2",
    ],
    votingSettings: {
      onlyListed: true,
      minApprovals: 1,
    },
  };
  const multisigPlugin = MultisigClient.encoding.getPluginInstallItem(
    multisigPluginParams,
  );
  multisigPlugin.id = "0x160b35934f24B1b7eE238d37Ca2F495AB1a5a803";
  const metadata: DaoMetadata = {
    name: "Multisig DAO #" + rand,
    description: "This is the description of a multisig dao",
    links: [],
  };
  const metadataUri = await client.methods.pinMetadata(metadata);
  const params: CreateDaoParams = {
    metadataUri,
    ensSubdomain: "multisig-voting-dao-" + rand,
    plugins: [
      multisigPlugin,
    ],
  };
  const steps = client.methods.createDao(params);
  for await (const step of steps) {
    switch (step.key) {
      case DaoCreationSteps.CREATING:
        console.log("creating...:" + step.txHash);
        break;
      case DaoCreationSteps.DONE:
        console.log("multisigDao:" + step.address);
        console.log("multisigDao plugins:" + step.pluginAddresses);
        multisigPluginAddress = step.pluginAddresses[0];
      default:
        break;
    }
  }
};
export const createAddresslistVotingDao = async () => {
  const rand = Math.ceil(Math.random() * 10000);
  const addresslistVotingPluginParams: IAddresslistVotingPluginInstall = {
    votingSettings: {
      minDuration: 3600,
      minParticipation: 0.5,
      supportThreshold: 0.5,
      minProposerVotingPower: BigInt(1),
      votingMode: VotingMode.STANDARD,
    },
    addresses: [
      "0x51798F574f728de2Eb706dFE154f62b36446dbe1",
    ],
  };
  const addresslistVotingPlugin = AddresslistVotingClient.encoding
    .getPluginInstallItem(
      addresslistVotingPluginParams,
    );
  addresslistVotingPlugin.id = "0xAbcf728903C84Abad57320fd78A7bb21ae07A261";
  const metadata: DaoMetadata = {
    name: "Token Voting DAO #" + rand,
    description: "This is the description of a token voting dao",
    links: [],
  };
  const metadataUri = await client.methods.pinMetadata(metadata);
  const params: CreateDaoParams = {
    metadataUri,
    ensSubdomain: "token-voting-dao-" + rand,
    plugins: [
      addresslistVotingPlugin,
    ],
  };

  const steps = client.methods.createDao(params);
  for await (const step of steps) {
    switch (step.key) {
      case DaoCreationSteps.CREATING:
        console.log("creating...:" + step.txHash);
        break;
      case DaoCreationSteps.DONE:
        console.log("addresslistVotingDao:" + step.address);
        console.log("addresslistVotingDao plugins:" + step.pluginAddresses);
        multisigPluginAddress = step.pluginAddresses[0];
      default:
        break;
    }
  }
};

export const createAdminDao = async () => {
  const rand = Math.ceil(Math.random() * 10000);

  const hexBytes = defaultAbiCoder.encode(
    [
      "address admin",
    ],
    [
      "0x51798F574f728de2Eb706dFE154f62b36446dbe1",
    ],
  );
  const adminPlugin = {
    id: "0xe6eEca8428b36ab2e5a96D3F8A903f3c3F8c6938",
    data: hexToBytes(hexBytes),
  };
  const metadata: DaoMetadata = {
    name: "Admin DAO #" + rand,
    description: "This is the description of a admin dao",
    links: [],
  };
  const metadataUri = await client.methods.pinMetadata(metadata);
  const params: CreateDaoParams = {
    metadataUri,
    ensSubdomain: "admin-dao-" + rand,
    plugins: [
      adminPlugin,
    ],
  };

  const steps = client.methods.createDao(params);
  for await (const step of steps) {
    switch (step.key) {
      case DaoCreationSteps.CREATING:
        console.log("creating...:" + step.txHash);
        break;
      case DaoCreationSteps.DONE:
        console.log("addresslistVotingDao:" + step.address);
        console.log("addresslistVotingDao plugins:" + step.pluginAddresses);
        multisigPluginAddress = step.pluginAddresses[0];
      default:
        break;
    }
  }
};
export const createTokenVotingProposal = async () => {
  const rand = Math.ceil(Math.random() * 10000);
  const metadata: ProposalMetadata = {
    title: "Token Proposal #" + rand,
    summary: "Summary of token voting proposal",
    description: "Description of token voting proposal",
    resources: [],
  };
  const metadataUri = await tokenVotingClient.methods.pinMetadata(metadata);
  let startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() + 10);
  let endDate = new Date();
  endDate.setHours(endDate.getHours() + 10);
  const params: CreateMajorityVotingProposalParams = {
    pluginAddress: tokenVotingPluginAddress,
    metadataUri,
    startDate,
    endDate,
  };
  const steps = tokenVotingClient.methods.createProposal(params);
  for await (const step of steps) {
    switch (step.key) {
      case ProposalCreationSteps.CREATING:
        console.log("creating...:" + step.txHash);
        break;
      case ProposalCreationSteps.DONE:
        console.log("tokenVoting proposal:" + step.proposalId);
      default:
        break;
    }
  }
};
export const createMultisigProposal = async () => {
  const rand = Math.ceil(Math.random() * 10000);
  const metadata: ProposalMetadata = {
    title: "Multisig Proposal #" + rand,
    summary: "Summary of Multisig voting proposal",
    description: "Description of Multisig voting proposal",
    resources: [],
  };
  const metadataUri = await multisigClient.methods.pinMetadata(metadata);
  let startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() + 10);
  let endDate = new Date();
  endDate.setHours(endDate.getHours() + 10);
  const params: CreateMajorityVotingProposalParams = {
    pluginAddress: multisigPluginAddress,
    metadataUri,
    startDate,
    endDate,
  };
  const steps = multisigClient.methods.createProposal(params);
  for await (const step of steps) {
    switch (step.key) {
      case ProposalCreationSteps.CREATING:
        console.log("creating...:" + step.txHash);
        break;
      case ProposalCreationSteps.DONE:
        console.log("multisig proposal:" + step.proposalId);
      default:
        break;
    }
  }
};
export const createAddresslistVotingProposal = async () => {
  const rand = Math.ceil(Math.random() * 10000);
  const metadata: ProposalMetadata = {
    title: "Addresslist Voting Proposal #" + rand,
    summary: "Summary of addresslist voting voting proposal",
    description: "Description of addresslist voting voting proposal",
    resources: [],
  };
  const metadataUri = await addresslistVotingClient.methods.pinMetadata(
    metadata,
  );
  let startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() + 10);
  let endDate = new Date();
  endDate.setHours(endDate.getHours() + 10);
  const params: CreateMajorityVotingProposalParams = {
    pluginAddress: addresslistPluginAddress,
    metadataUri,
    startDate,
    endDate,
  };
  const steps = addresslistVotingClient.methods.createProposal(params);
  for await (const step of steps) {
    switch (step.key) {
      case ProposalCreationSteps.CREATING:
        console.log("creating...:" + step.txHash);
        break;
      case ProposalCreationSteps.DONE:
        console.log("addresslistVoting proposal:" + step.proposalId);
      default:
        break;
    }
  }
};
export const createAdminProposal = async () => {
  const adminContract = aragonContracts.Admin__factory.connect(
    adminPluginAddress,
    ctx.signer!,
  );
  const rand = Math.ceil(Math.random() * 10000);
  const metadata: ProposalMetadata = {
    title: "Admin Proposal #" + rand,
    summary: "Summary of Admin proposal",
    description: "Description of admin proposal",
    resources: [],
  };
  const metadataUri = await addresslistVotingClient.methods.pinMetadata(
    metadata,
  );
  try {
    console.log("creating...");
    await adminContract.executeProposal(toUtf8Bytes(metadataUri), [], []);
    console.log("done");
  } catch (e) {
    console.log(e);
  }
};
export const voteTokenVotingProposal = async () => {
  const steps = tokenVotingClient.methods.voteProposal({
    proposalId: tokenVotingPluginAddress + "_0x0",
    vote: VoteValues.YES,
  });
  for await (const step of steps) {
    switch (step.key) {
      case VoteProposalStep.VOTING:
        console.log("creating...:" + step.txHash);
        break;
      case VoteProposalStep.DONE:
        console.log("voted");
      default:
        break;
    }
  }
};
export const voteMultisigProposal = async () => {
  const steps = multisigClient.methods.approveProposal({
    proposalId: multisigPluginAddress + "_0x0",
    tryExecution: false,
  });
  for await (const step of steps) {
    switch (step.key) {
      case ApproveProposalStep.APPROVING:
        console.log("creating...:" + step.txHash);
        break;
      case ApproveProposalStep.DONE:
        console.log("voted");
      default:
        break;
    }
  }
};
export const voteAddresslistVotingProposal = async () => {
  const steps = addresslistVotingClient.methods.voteProposal({
    proposalId: addresslistPluginAddress + "_0x0",
    vote: VoteValues.YES,
  });
  for await (const step of steps) {
    switch (step.key) {
      case VoteProposalStep.VOTING:
        console.log("creating...:" + step.txHash);
        break;
      case VoteProposalStep.DONE:
        console.log("voted");
      default:
        break;
    }
  }
};
export const depositEth = async () => {
  const steps = client.methods.deposit({
    type: TokenType.NATIVE,
    amount: BigInt(1),
    daoAddressOrEns: "0x968ea45062ca6e5bd3799d8c4e11edc3c754efcc"
  })
  for await (const step of steps) {
    switch (step.key) {
      case DaoDepositSteps.DEPOSITING:
        console.log("creating...:" + step.txHash);
        break;
      case DaoDepositSteps.DONE:
        console.log("deposited");
        break;
      default:
        break;
    }
  }
}

export const getDaos = async () => {
  return await client.methods.getDaos({});
};
export const withdrawAction = async () => {
  return await client.encoding.withdrawAction({
    type: TokenType.NATIVE,
    amount: BigInt(1),
    recipientAddressOrEns: "0x1234567890123456789012345678901234567890",
  });
};

export const tokenVotingMembers = async () => {
  return await tokenVotingClient.methods.getMembers(
    "0xc79615c16cf360ae4b371c053593a8c0d6272110",
  );
};
export const tokenVotingProposals = async () => {
  return await tokenVotingClient.methods.getProposals({
    daoAddressOrEns: "0xc79615c16cf360ae4b371c053593a8c0d6272110",
  });
};

export async function createDAO(
  daoFactory: aragonContracts.DAOFactory,
  daoSettings: aragonContracts.DAOFactory.DAOSettingsStruct,
  pluginSettings: aragonContracts.DAOFactory.PluginSettingsStruct[],
): Promise<{ daoAddr: string; pluginAddrs: string[] }> {
  const tx = await daoFactory.createDao(daoSettings, pluginSettings);
  const receipt = await tx.wait();
  const registryInterface = aragonContracts.DAORegistry__factory
    .createInterface();
  const registeredLog = receipt.logs.find(
    (log) =>
      log.topics[0] ===
        id(registryInterface.getEvent("DAORegistered").format("sighash")),
  );

  const pluginSetupProcessorInterface = aragonContracts
    .PluginSetupProcessor__factory.createInterface();
  const installedLogs = receipt.logs.filter(
    (log) =>
      log.topics[0] ===
        id(
          pluginSetupProcessorInterface
            .getEvent("InstallationApplied")
            .format("sighash"),
        ),
  );
  if (!registeredLog) {
    throw new Error("Failed to find log");
  }

  const registeredParsed = registryInterface.parseLog(registeredLog);
  return {
    daoAddr: registeredParsed.args[0],
    pluginAddrs: installedLogs.map(
      (log) => pluginSetupProcessorInterface.parseLog(log).args[1],
    ),
  };
}
