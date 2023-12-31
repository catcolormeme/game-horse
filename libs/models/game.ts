import { model, models, Schema } from "mongoose";
import { IGame } from "../interface/game";
import connectMongo from "../services/database";
import { User } from "./user";

connectMongo();

const AmountToPaySchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
});

const GameSchema = new Schema({
  userToken: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  betAmount: {
    type: Number,
    required: true,
  },
  selectedSide: {
    type: String,
    required: true,
  },
});

export const Game = models.Game || model("Game", GameSchema);
export const AmountToPay = models.AmountToPay || model("AmountToPay", AmountToPaySchema);

export const newGame = async (
  userToken: string,
  username: string,
  img: string,
  betAmount: number,
  selectedSide: string
) => {
  const games = await Game.findOne({ userToken: userToken });
  if (games) {
    return { success: false, message: "User already in game" };
  }
  const game = new Game({
    userToken,
    username,
    img,
    betAmount,
    selectedSide,
  });
  let amountExists = await AmountToPay.findOne({});
  if(amountExists){
    amountExists.amount += betAmount;
  }else{
    amountExists = new AmountToPay({
      amount: betAmount,
    });
  }
  
  // const amountToPay = new AmountToPay({
  //   amount: amountExists.amount + betAmount,
  // });
  const user = await User.findOne({ userToken: userToken });
  if (user) {
    user.deposit -= betAmount;
    await user.save();
  } else {
    return { success: false, message: "User not found" };
  }
  await game.save();
  await amountExists.save();
  return { success: true, game };
};

export const getGames = async () => {
  let games: IGame[];
  games = await Game.find({}).sort({ _id: -1 });
  return games;
};

export const getGameByToken = async (userToken: string) => {
  return Game.findOne({ userToken });
};

export const deleteOneGame = async (
  userToken: string,
  selectedSide: string
) => {
  return Game.deleteOne({ userToken: userToken, selectedSide: selectedSide });
};

export const deleteGames = async () => {
  let games: IGame[];
  games = await Game.find({}).sort({ _id: -1 });
  await Game.deleteMany({}, games);
  return { success: true, games };
};
