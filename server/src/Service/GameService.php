<?php


namespace App\Service;


use App\Entity\Room;
use App\Entity\User;
use App\Utils\Card\Card;
use App\Utils\Card\SuitDictionary;
use App\Utils\Card\ValueDictionary;
use App\Utils\Game\Macao;

class GameService
{

    public function __construct()
    {

    }

    public function startGame(Room $room, $gameType){
        $room->setIsGameRunning(true);
        $room->setCurrentDeck($this->createDeck());
        $room->setUsedDeck([]);
        $room->getUsersInRoom()[0]->setIsNow(true);
        $room->setGameType($gameType);
        foreach ($room->getUsersInRoom() as $user){
            $cards = [];
            for ($i=0; $i<5; $i++){
                $cards[] = $room->drawCard();
            }
            $user->setCards($cards);
        }


        $card = $room->drawCard();
        while (in_array($card->value, ValueDictionary::ACTION_VALUES)){
            $room->addUsedCards([$card]);
            $card = $room->drawCard();
        }

        $room->setCurrentCard($card);

    }

    public function createDeck()
    {
        $deck = [];
        foreach (SuitDictionary::getSuits() as $suit){
            foreach (ValueDictionary::getValues() as $value){
                $deck[] = new Card($suit, $value);
            }
        }
        shuffle($deck);
        return $deck;
    }

    public function playCards(Room $room, User $user, array $cards, $choose){
        $room->addUsedCards($cards);
        $user->removeCards($cards);
        $card = Card::getFromAlias($cards[count($cards)-1]);
        $room->setCurrentCard($card);
        $counter = 0;
        $action = null;
        foreach ($cards as $card){
            $action = Macao::actionCard($card, $choose);
            if (in_array($action->type, [
                Macao::DRAW,
                Macao::STOP
            ])){
                $counter+=$action->content;
            }

        }

        $action->content = $counter+$room->getDraw()+$room->getStay();
        if ($action->type==Macao::DRAW){
            $room->setDraw($action->content);
        }elseif($action->type==Macao::STOP){
            $room->setStay($action->content);
        }
        return $action;

    }

    public function drawCards(Room $room, User $user, int $howMany){
        $deck = $room->getCurrentDeck();
        $newCards = [];
        $room->setDraw(0);
        $room->setStay(0);
        if (count($deck)>=$howMany)
        {
            for ($i=0; $i<$howMany; $i++){
                $newCards[] = $room->drawCard();
            }
        }else{
            $cardsLeft  = count($deck);
            for ($i=0; $i<$cardsLeft; $i++){
                $newCards[] = $room->drawCard();
            }
            $oldDeck = $room->getUsedDeck();
            shuffle($oldDeck);
            $deck = $oldDeck;
            $room->setUsedDeck([]);
            for ($i=$cardsLeft; $i<$howMany; $i++){
                $newCards[] = $room->drawCard();
            }
        }
        $room->setCurrentDeck($deck);
        $user->addCards($newCards);
        return $newCards;
    }

    public function checkIfEnd(Room $room, User $user){
        if (count($user->getCards())==0){
            $room->setIsGameRunning(false);
            return true;
        }
        return false;
    }

    public function nextUser(Room $room){
        $users = $room->getUsersInRoom();
        for ($i = 0; $i<count($users); $i++){
            if ($users[$i]->getIsNow()){
                $users[$i]->setIsNow(false);
                if ($i==count($users)-1){
                    $users[0]->setIsNow(true);
                    return $users[0];
                }
                else{
                    $users[$i+1]->setIsNow(true);
                    return $users[$i+1];
                }
            }

        }
        return null;
    }
    public function previousUser(Room $room){
        $users = $room->getUsersInRoom();
        for ($i = 0; $i<count($users); $i++){
            if ($users[$i]->getIsNow()){
                $users[$i]->setIsNow(false);
                if ($i==0){
                    $users[count($users)-1]->setIsNow(true);
                    return $users[count($users)-1];
                }
                else{
                    $users[$i-1]->setIsNow(true);
                    return $users[$i-1];
                }
            }

        }
        return null;
    }
}
