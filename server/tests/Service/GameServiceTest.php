<?php

namespace App\Tests\Service;

use App\Entity\Room;
use App\Entity\User;
use App\Service\GameService;
use App\Utils\Card\Card;
use App\Utils\Game\Game;
use App\Utils\Struct\CardActionStruct;
use PHPUnit\Framework\TestCase;

class GameServiceTest extends TestCase
{

    /** @var GameService  */
    protected $service;

    protected function setUp(): void
    {
        $this->service = new GameService();
    }

    public function testStartGame()
    {
        $room = new Room();
        $room->setGameType(Game::MACAO);
        $user1 = new User();
        $user2 = new User();
        $room->addUsersInRoom($user1);
        $room->addUsersInRoom($user2);
        $this->service->startGame($room);
        $this->assertTrue($room->getIsGameRunning());
        $this->assertCount(5, $user1->getCards());
        $this->assertCount(5, $user2->getCards());
        $room->setGameType(Game::PAN);
        $this->service->startGame($room);
        $this->assertCount(12, $user1->getCards());
        $this->assertCount(12, $user2->getCards());



    }

    public function testCreateDeck()
    {
        $deck = $this->service->createDeck();

        $this->assertCount(52, $deck);
        $this->assertInstanceOf(Card::class, $deck[0]);
        $this->assertEquals(2, strlen($deck[0]->__toString()));

    }

    public function testPlayThree(){
        $room = new Room();
        $room->setGameType(Game::MACAO);
        $user1 = new User();
        $user2 = new User();
        $room->addUsersInRoom($user1);
        $room->addUsersInRoom($user2);
        $this->service->startGame($room);
        $action = $this->service->playCards($room, $user1, ["3H"], null);
        $this->assertInstanceOf(CardActionStruct::class, $action);
        $this->assertEquals(3, $action->content);
        $this->assertStringContainsString("3", $action->text);
        $action = $this->service->playCards($room, $user2, ["3D, 3S"], null);
        $this->assertEquals(6, $action->content);
        $this->assertStringContainsString("6", $action->text);

    }

    public function testGetNextUser(){
        $room = new Room();
        $room->setGameType(Game::MACAO);
        $user1 = new User();
        $user1->setUsername("User1");
        $user2 = new User();
        $user2->setUsername("User2");
        $room->addUsersInRoom($user1);
        $room->addUsersInRoom($user2);
        $user1->setIsNow(true);
        $user2->setStop(2);
        $nextUser = $this->service->nextUser($room);
        $this->assertEquals($user1->getUsername(), $nextUser->getUsername());

    }

    public function testStartPlayerPan(){
        $room = new Room();
        $room->setGameType(Game::PAN);
        $user1 = new User();
        $user2 = new User();
        $room->addUsersInRoom($user1);
        $room->addUsersInRoom($user2);
        $this->service->startGame($room);
        /** @var Card $card */
        foreach ($user1->getCards() as $card){
            if ($card->__toString() == "9H"){
                $this->assertTrue($user1->getIsNow());
            }
        }
        /** @var Card $card */
        foreach ($user2->getCards() as $card){
            if ($card->__toString() == "9H"){
                $this->assertTrue($user2->getIsNow());
            }
        }
    }
}
