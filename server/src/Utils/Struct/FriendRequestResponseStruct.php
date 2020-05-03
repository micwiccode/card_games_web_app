<?php


namespace App\Utils\Struct;


use App\Entity\FriendRequest;

class FriendRequestResponseStruct
{
    public $id;

    public $senderName;

    public static function mapFromFriendRequest(FriendRequest $request)
    {
        $struct = new FriendRequestResponseStruct();
        $struct->id = $request->getId();
        $struct->senderName = $request->getUser()->getUsername();

        return $struct;
    }

}