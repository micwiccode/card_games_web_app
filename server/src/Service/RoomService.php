<?php


namespace App\Service;


use App\Entity\Room;
use App\Entity\User;
use App\Utils\Struct\RoomResponseStruct;
use App\Utils\Struct\UserResponseStruct;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;

class RoomService
{
    private $em;
    private $security;

    public function __construct(EntityManagerInterface $em, Security $security)
    {
        $this->em = $em;
        $this->security = $security;
    }

    public function createRoom($password, $name, $maxPeople): Room {
        $room = new Room();
        /** @var User $user */
        $user = $this->security->getUser();
        $user->setIsRoomAdmin(true);
        $room->setPassword($password);
        $room->setName($name);
        $room->setMaxPeople($maxPeople);
        $room->addUsersInRoom($user);
        return $room;
    }

    public function enterRoom(Room $room): bool {

        /** @var User $user */
        $user = $this->security->getUser();
        if(count($room->getUsersInRoom())<$room->getMaxPeople()){
            $room->addUsersInRoom($user);
        }else{
            return false;
        }
        return true;
    }

    public function exitRoom(){
        /** @var User $user */
        $user = $this->security->getUser();
        $room = $user->getRoom();
        $room->removeUsersInRoom($user);
        if($user->getIsRoomAdmin()){
            $user->setIsRoomAdmin(false);
            if(count($room->getUsersInRoom())>0){
                $room->getUsersInRoom()[0]->setIsRoomAdmin(true);
            }else{
                $this->em->remove($room);
            }
        }
        $user->setRoom(null);
        return $room;
    }

    public function getUsersInRoom(Room $room){
        $usersData['users'] = [];
        foreach ($room->getUsersInRoom() as $user) {
            $usersData['users'][] = UserResponseStruct::mapFromUser($user);
        }
        return $usersData;
    }

    public function getRoomList(){
        $roomList['rooms'] = [];
        foreach ($this->em->getRepository(Room::class)->findAll() as $room){
            $roomList['rooms'][] = RoomResponseStruct::mapFromRoom($room);
        }
        return $roomList;
    }

}