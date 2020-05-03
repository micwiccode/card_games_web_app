<?php

namespace App\Tests\Utils\Struct;

use App\Entity\Room;
use App\Utils\Struct\RoomResponseStruct;
use PHPUnit\Framework\TestCase;

class RoomResponseStructTest extends TestCase
{

    public function testMapFromRoom()
    {
        $room = new Room();
        $room->setName('Mój pokój');
        $room->setPassword('password');
        $room->setMaxPeople(4);

        $roomResponse = RoomResponseStruct::mapFromRoom($room);
        $this->assertInstanceOf(RoomResponseStruct::class, $roomResponse);
        $this->assertEquals($room->getName(), $roomResponse->name);
        $this->assertEquals($room->getMaxPeople(), $roomResponse->maxPeople);
        $this->assertEquals($room->getPassword(), $roomResponse->password);

    }
}
