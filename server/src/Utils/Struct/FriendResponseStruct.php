<?php


namespace App\Utils\Struct;


use App\Entity\User;

class FriendResponseStruct
{
    public $id;

    public $name;

    public static function mapFromFriend(User $user)
    {
        $friend = new FriendResponseStruct();
        $friend->id = $user->getId();
        $friend->name = $user->getUsername();
        return $friend;
    }

}