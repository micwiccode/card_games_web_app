<?php


namespace App\Utils\Struct;


use App\Utils\Card\Card;

class CardsResponseStruct
{
    public $cards = [];

    /**
     * @param Card[] $cards
     * @return CardsResponseStruct
     */
    public static function mapFromCardsArray(array $cards)
    {
        $struct = new CardsResponseStruct();
        foreach ($cards as $card){
            $struct->cards[] = $card->__toString();
        }
        return $struct;
    }

}
