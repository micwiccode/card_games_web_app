<?php


namespace App\Service;


use App\Entity\Room;
use App\Entity\User;
use App\Utils\Struct\CardActionStruct;
use App\Utils\Struct\UserInGameResponseStruct;
use App\Utils\Struct\PlayerResponseStruct;
use App\Utils\Struct\UserResponseStruct;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;

class PublisherService
{
    const GAME_TOPIC = "gameInfo/";
    const ROOM_TOPIC = "roomInfo/";
    private $publisher;

    public function __construct(PublisherInterface $publisher)
    {
        $this->publisher = $publisher;
    }


    private function publish($topic, $json)
    {
        $publisher = $this->publisher;
        $publisher(new Update($topic, $json));

    }

    public function updatePeopleInRoom(Room $room)
    {
        $topic = self::ROOM_TOPIC . $room->getId();
        $data = $room->getUsersInRoom();
        foreach ($room->getUsersInRoom() as $user) {
            $data[] = UserResponseStruct::mapFromUser($user);
        }
        $this->publish($topic, json_encode($data));

    }

    public function startGame(Room $room){
        $topic = self::GAME_TOPIC . $room->getId();
        $data['start'] = [];
        foreach ($room->getUsersInRoom() as $user){
            $data['start']['cards'][] = UserInGameResponseStruct::mapFromUser($user);
        }
        $data['start']['turn'] = UserResponseStruct::mapFromUser($room->getCurrentPlayer());
        $this->publish($topic, json_encode($data));
    }

    public function playCard(Room $room, CardActionStruct $actionStruct, bool $isEnd = false){
        $topic = self::GAME_TOPIC . $room->getId();
        $data['play'] = ['action' => $actionStruct, 'isEnd' => $isEnd];
        $this->publish($topic, json_encode($data));
    }

    public function drawCards(Room $room, User $user, int $howMany)
    {
        $topic = self::GAME_TOPIC . $room->getId();
        $data['draw'] = ['userId' => $user->getId(), 'username' => $user->getUsername(), 'newCards' => $howMany];
        $this->publish($topic, json_encode($data));
    }

    public function nextUser(Room $room, User $user){
        $topic = self::GAME_TOPIC . $room->getId();
        $data['next'] = ['userId' => $user->getId(),'username' => $user->getUsername()];
        $this->publish($topic, json_encode($data));
    }


}
