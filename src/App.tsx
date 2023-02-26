import { useState } from "react";
import "./App.css";
import {
  createAddresslistVotingDao,
  createAddresslistVotingProposal,
  createAdminDao,
  createMultisigDao,
  createMultisigProposal,
  createTokenVotingDao,
  createTokenVotingProposal,
  depositEth,
  getDaos,
  tokenVotingMembers,
  tokenVotingProposals,
  voteAddresslistVotingProposal,
  voteMultisigProposal,
  voteTokenVotingProposal,
  withdrawAction,
} from "./lib/utils";

function App() {
  const handleOnClick = async () => {
    const daos = await getDaos();
    console.log(daos);
  };
  const handleWithdrawOnClick = async () => {
    const daos = withdrawAction();
    console.log(daos);
  };
  const handleTokenVotingMemebersOnClick = async () => {
    console.log("hhehe");
    const daos = await tokenVotingMembers();
    console.log(daos);
  };
  const handleTokenVotingProposalsOnClick = async () => {
    console.log("hhehe");
    const daos = await tokenVotingProposals();
    console.log(daos);
  };
  const handleCreateTokenVotingDao = async () => {
    await createTokenVotingDao();
  };
  const handleCreateMultisigDao = async () => {
    await createMultisigDao();
  };
  const handleCreateAddresslistVotingDao = async () => {
    await createAddresslistVotingDao();
  };
  const handleCreateAdminDao = async () => {
    await createAdminDao();
  };
  const handleCreateAllDaos = async () => {
    await createTokenVotingDao();
    await createMultisigDao();
    await createAddresslistVotingDao();
  };
  const handleCreateTokenVotingProposal = async () => {
    await createTokenVotingProposal();
  };
  const handleCreateMultisigProposal = async () => {
    await createMultisigProposal();
  };
  const handleCreateAddresslistVotingProposal = async () => {
    await createAddresslistVotingProposal();
  };
  const handleCreateAllProposals = async () => {
    await createTokenVotingProposal();
    await createMultisigProposal();
    await createAddresslistVotingProposal();
  };
  const handleVoteTokenVotingProposal = async () => {
    await voteTokenVotingProposal();
  };
  const handleVoteMultisigProposal = async () => {
    await voteMultisigProposal();
  };
  const handleVoteAddresslistVotingProposal = async () => {
    await voteAddresslistVotingProposal();
  };
  const handleVoteAllProposals = async () => {
    await voteTokenVotingProposal();
    await voteMultisigProposal();
    await voteAddresslistVotingProposal();
  };
  const handleDeposit = async () => {
    await depositEth();
  };
  return (
    <div className="App">
      <button onClick={handleOnClick}>get daos</button>
      <button onClick={handleWithdrawOnClick}>withdraw action</button>
      <button onClick={handleTokenVotingMemebersOnClick}>
        getMembers token
      </button>
      <button onClick={handleTokenVotingProposalsOnClick}>
        getProposals token
      </button>
      <button onClick={handleCreateTokenVotingDao}>
        create token voting dao
      </button>
      <button onClick={handleCreateMultisigDao}>create multisig dao</button>
      <button onClick={handleCreateAddresslistVotingDao}>
        create addresslist dao
      </button>
      <button onClick={handleCreateAdminDao}>create admin dao</button>
      <button onClick={handleCreateAllDaos}>create all daos</button>
      <button onClick={handleCreateTokenVotingProposal}>
        create token voting proposal
      </button>
      <button onClick={handleCreateMultisigProposal}>
        create multisig proposal
      </button>
      <button onClick={handleCreateAddresslistVotingProposal}>
        create addresslist proposal
      </button>
      <button onClick={handleCreateAllProposals}>create all proposals</button>
      <button onClick={handleVoteTokenVotingProposal}>
        vote token voting proposal
      </button>
      <button onClick={handleVoteMultisigProposal}>
        vote multisig proposal
      </button>
      <button onClick={handleVoteAddresslistVotingProposal}>
        vote addresslist proposal
      </button>
      <button onClick={handleVoteAllProposals}>create all proposals</button>
      <button onClick={handleDeposit}>Deposit</button>
    </div>
  );
}

export default App;
