<?php


namespace App\Service;


use App\Entity\Room;
use App\Entity\User;
use App\Utils\Card\Card;
use App\Utils\Card\SuitDictionary;
use App\Utils\Card\ValueDictionary;
use App\Utils\Game\Game;
use App\Utils\Game\Macao;

class GameService
{

    public function __construct()
    {

    }

    public function startGame(Room $room){
        $room->setIsGameRunning(true);
        $gameType = $room->getGameType();
        if ($gameType==Game::MACAO)
        {
            $room->setCurrentDeck($this->createDeck());
            $room->setUsedDeck([]);
            foreach ($room->getUsersInRoom() as $user){
                $user->setIsNow(false);
            }
            $room->getUsersInRoom()[0]->setIsNow(true);
            $room->setStay(0);
            $room->setDraw(0);
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
        elseif ($gameType==Game::PAN){
            $deck = $this->createShortDeck();
            $users = $room->getUsersInRoom();
            $users_deck = array_chunk($deck, count($deck)/count($users));
            for ($i =0; $i<count($users_deck); $i++){
                $users[$i]->setCards($users_deck[$i]);
            }
            foreach ($users as $user){
                $user->setIsNow(false);
            }
            foreach ($users as $user){
                /** @var Card $card */
                foreach ($user->getCards() as $card){
                    if ($card->__toString() == "9H"){
                        $user->setIsNow(true);
                    }
                }
            }
            $room->setUsedDeck([]);
            $room->setCurrentDeck([]);

        }
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

    public function createShortDeck(){
        $deck = [];
        foreach (SuitDictionary::getSuits() as $suit){
            foreach (ValueDictionary::getShortDeckValues() as $value){
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
                Macao::STOP,
                Macao::DRAW_PREVIOUS
            ])){
                $counter+=$action->content;
            }

        }

        if ($action->type == Macao::DRAW || $action->type == Macao::DRAW_PREVIOUS){
            $action->content = $counter+$room->getDraw();
        }elseif ($action->type == Macao::STOP){
            $action->content = $counter+$room->getStay();
        }
        $action->text = Macao::createText($action->type, $action->content);
        if ($action->type==Macao::DRAW || $action->content == Macao::DRAW_PREVIOUS){
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
            $room->setCurrentDeck($oldDeck);
            $room->setUsedDeck([]);
            for ($i=$cardsLeft; $i<$howMany; $i++){
                $newCards[] = $room->drawCard();
            }
        }
        $user->addCards($newCards);
        return $newCards;
    }

    public function
    checkIfEnd(Room $room, User $user){
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
                return $this->findNextUserWithoutStop($room, $i);
            }

        }
        return null;
    }
    public function previousUser(Room $room){
        $users = $room->getUsersInRoom();
        for ($i = 0; $i<count($users); $i++){
            if ($users[$i]->getIsNow()){
                $users[$i]->setIsNow(false);
                return $this->findPrevUserWithoutStop($room, $i);
            }

        }
        return null;
    }

    private function findNextUserWithoutStop(Room $room, $index){
        $users = $room->getUsersInRoom();
        if ($index==(count($users)-1)){
            $i = 0;
        }else{
            $i = $index+1;
        }
        while (true)
        {
            if ($users[$i]->getStop()!=0){
                $users[$i]->setStop($users[$i]->getStop()-1);
                $i++;
            }else{
                $users[$i]->setIsNow(true);
                return $users[$i];
            }

            if ($i==count($users)){
                $i=0;
            }
        }
        return null;
    }

    private function findPrevUserWithoutStop(Room $room, $index){
        $users = $room->getUsersInRoom();
        if ($index==0){
            $i = count($users)-1;
        }else{
            $i = $index-1;
        }
        while (true)
        {
            if ($users[$i]->getStop()!=0){
                $users[$i]->setStop($users[$i]->getStop()-1);
                $i--;
            }else{
                $users[$i]->setIsNow(true);
                return $users[$i];
            }
            if ($i==-1){
                $i=count($users)-1;
            }
        }
        return null;
    }
}
