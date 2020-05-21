<?php


namespace App\Utils\Game;


use App\Utils\Card\Card;
use App\Utils\Card\SuitDictionary;
use App\Utils\Card\ValueDictionary;
use App\Utils\Struct\CardActionStruct;

class Macao implements Game
{
    //Possible actions
    const DRAW = 'Draw';

    const STOP = 'Stop';

    const REQUEST = 'Request';

    const COLOR_CHANGE = 'Color change';

    const NOTHING = 'Nothing';

    const DRAW_PREVIOUS = "Draw previous";



    public static function actionCard(string $cardAlias, $choose = null): CardActionStruct{
        $card = Card::getFromAlias($cardAlias);
        switch ($card->value){
            case ValueDictionary::ACE: $action = self::actionOnAce($choose);break;
            case ValueDictionary::KING: $action = self::actionOnKing($card->suit);break;
            case ValueDictionary::QUEEN: $action = self::actionOnQueen();break;
            case ValueDictionary::JACK:  $action = self::actionOnJack($choose);break;
            case ValueDictionary::TEN:  $action = self::actionOnTen();break;
            case ValueDictionary::NINE:  $action = self::actionOnNine();break;
            case ValueDictionary::EIGHT:  $action = self::actionOnEight();break;
            case ValueDictionary::SEVEN: $action = self::actionOnSeven();break;
            case ValueDictionary::SIX: $action = self::actionOnSix();break;
            case ValueDictionary::FIVE: $action = self::actionOnFive();break;
            case ValueDictionary::FOUR: $action = self::actionOnFour();break;
            case ValueDictionary::THREE: $action = self::actionOnThree();break;
            case ValueDictionary::TWO: $action = self::actionOnTwo();break;
            default: $action = null;
        }
        $action->text = self::createText($action->text, $action->content);
        return $action;
    }

    private static function createText($type, $content){
        switch ($type){
            case Macao::STOP: {
                if ($content==1){
                    return "Stoisz 1 turę";
                }else{
                    return printf("Stoisz %d tury", $content);
                }
            }break;
            case Macao::DRAW_PREVIOUS:
            case Macao::DRAW:{
                if ($content<5){
                    return printf("Dobierz %d karty", $content);
                }else{
                    return printf("Dobierz %d kart", $content);
                }
            }break;
            case Macao::COLOR_CHANGE: {
                $polishColor = SuitDictionary::getPolishRepresentation($content);
                return printf("Zamiana koloru na: %s", $polishColor);
            }
            case Macao::REQUEST: {
                $polishValue = ValueDictionary::getPolishRepresentation($content);
                return printf("Żądanie: %s", $polishValue);
            }
        }
    }


    private static function actionOnTwo(): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        $cardAction->type = Macao::DRAW;
        $cardAction->content = 2;
        return $cardAction;
    }

    private static function actionOnThree(): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        $cardAction->type = Macao::DRAW;
        $cardAction->content = 2;
        return $cardAction;
    }

    private static function actionOnFour(): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        $cardAction->type = Macao::STOP;
        $cardAction->content = 1;
        return $cardAction;
    }

    private static function actionOnFive(): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        $cardAction->type = Macao::NOTHING;
        return $cardAction;
    }

    private static function actionOnSix(): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        $cardAction->type = Macao::NOTHING;
        return $cardAction;
    }

    private static function actionOnSeven(): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        $cardAction->type = Macao::NOTHING;
        return $cardAction;
    }

    private static function actionOnEight(): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        $cardAction->type = Macao::NOTHING;
        return $cardAction;
    }

    private static function actionOnNine(): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        $cardAction->type = Macao::NOTHING;
        return $cardAction;
    }

    private static function actionOnTen(): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        $cardAction->type = Macao::NOTHING;
        return $cardAction;
    }

    private static function actionOnJack(string $choose): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        $cardAction->type = Macao::REQUEST;
        $cardAction->content = $choose;
        return $cardAction;
    }

    private static function actionOnQueen(): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        $cardAction->type = Macao::NOTHING;
        return $cardAction;
    }

    private static function actionOnKing(string $suit): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        if ($suit==SuitDictionary::HEARTS){
            $cardAction->type = Macao::DRAW;
            $cardAction->content = 5;
        }elseif ($suit==SuitDictionary::SPADES){
            $cardAction->type = Macao::DRAW_PREVIOUS;
            $cardAction->content = 5;
        }
        else{
            $cardAction->type = Macao::NOTHING;
        }
        return $cardAction;
    }

    private static function actionOnAce(string $choose): CardActionStruct
    {
        $cardAction = new CardActionStruct();
        $cardAction->type = Macao::COLOR_CHANGE;
        $cardAction->content = $choose;
        return $cardAction;
    }
}
