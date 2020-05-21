<?php


namespace App\Utils\Game;



use App\Utils\Struct\CardActionStruct;

interface Game
{
    public const MACAU = "Macau";
    public static function actionCard(string $cardAlias): CardActionStruct;


}
