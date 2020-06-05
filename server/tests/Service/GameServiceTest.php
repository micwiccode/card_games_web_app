<?php

namespace App\Tests\Service;

use App\Entity\Room;
use App\Entity\User;
use App\Service\GameService;
use App\Utils\Card\Card;
use App\Utils\Game\Game;
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
        $user1 = new User();
        $user2 = new User();
        $room->addUsersInRoom($user1);
        $room->addUsersInRoom($user2);
        $this->service->startGame($room, Game::MACAO);
        $this->assertTrue($room->getIsGameRunning());
        $this->assertCount(42, $room->getCurrentDeck());
        var_dump($room->getCurrentDeck());
        $this->assertCount(5, $user1->getCards());
        $this->assertCount(5, $user2->getCards());


    }

    public function testCreateDeck()
    {
        $deck = $this->service->createDeck();

        $this->assertCount(52, $deck);
        $this->assertInstanceOf(Card::class, $deck[0]);
        $this->assertEquals(2, strlen($deck[0]->__toString()));

    }
}
