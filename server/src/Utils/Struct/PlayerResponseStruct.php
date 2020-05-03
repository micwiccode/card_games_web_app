<?php


namespace App\Utils\Struct;


use App\Entity\Player;

class PlayerResponseStruct
{
    public $id;

    public $name;

    public $points;

    public static function mapFromPlayer(Player $player)
    {
        $struct = new PlayerResponseStruct();
        $struct->id = $player->getId();
        $struct->name = $player->getUsername();
        $struct->points = $player->getPoints();
        return $struct;
    }

}