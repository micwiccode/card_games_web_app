<?php


namespace App\Utils\Struct;


use App\Entity\User;
use App\Utils\Card\Card;

class UserInGameResponseStruct
{
    public $deck = [];

    public $userId;

    public $username;

    public static function mapFromUser(User $user)
    {
        $struct = new UserInGameResponseStruct();
        /** @var Card $card */
        foreach ($user->getCards() as $card){
            $struct->deck[] = $card->__toString();
        }
        $struct->userId = $user->getId();
        $struct->username = $user->getUsername();
        return $struct;
    }

}
